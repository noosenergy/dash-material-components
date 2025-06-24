import { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import { pythonLanguage } from '@codemirror/lang-python';

// Type definitions
//class, constant, enum, function, interface, keyword, method, namespace, property, text, type, and variable

export interface CompletionItem {
  label: string;
  type: 'class' | 'function' | 'method' | 'property' | 'variable' | 'interface';
  info?: string;
  returns?: string;
}

export interface ModuleDefinition {
  [moduleName: string]: {
    importName?: string;
    items: Record<string, {
      type: CompletionItem['type'];
      info?: string;
      returns?: string;
      items?: Record<string, any>;
    }>;
  };
}

export class AutocompleteManager {
  // Single map for completions and return types
  private index = {
    completions: {} as Record<string, CompletionItem[]>,
    returns: {} as Record<string, string>
  };

  constructor(moduleDefinitions: ModuleDefinition[]) {
    this.buildIndex(moduleDefinitions);
  }

  // Build index from module definitions
  private buildIndex(defs: ModuleDefinition[]): void {
    defs.forEach(def => {
      Object.entries(def).forEach(([moduleName, moduleData]) => {
        this.indexModule(moduleName, moduleData.items);
      });
    });
  }

  // Index a module and its items recursively
  private indexModule(path: string, items: Record<string, any>): void {
    // Index current path completions
    this.index.completions[path] = this.mapItems(items);
    
    // Process each item
    Object.entries(items).forEach(([name, data]) => {
      const itemPath = `${path}.${name}`;
      
      // Store return type
      if (data.returns) this.index.returns[itemPath] = data.returns;
      
      // Process nested items
      if (data.items) {
        // Index methods for classes
        if (data.type === 'class') this.index.completions[itemPath] = this.mapItems(data.items);
        
        // Process submodules
        if (data.type === 'interface') this.indexModule(itemPath, data.items);
        
        // Store method return types
        this.mapReturnTypes(itemPath, data.items);
      }
    });
  }
  
  // Map items to completion items
  private mapItems(items: Record<string, any>): CompletionItem[] {
    return Object.entries(items).map(([name, data]) => ({
      label: name,
      type: data.type,
      info: data.info,
      returns: data.returns
    }));
  }
  
  // Store return types for methods
  private mapReturnTypes(basePath: string, items: Record<string, any>): void {
    Object.entries(items).forEach(([name, data]) => {
      if (data.returns) this.index.returns[`${basePath}.${name}`] = data.returns;
    });
  }

  // Parse expression into parts, respecting parentheses
  private parsePath(expr: string): string[] {
    const parts = [];
    let current = '';
    let parenLevel = 0;
    
    for (let i = 0; i < expr.length; i++) {
      const char = expr.charAt(i);
      if (char === '(') parenLevel++;
      else if (char === ')') parenLevel--;
      else if (char === '.' && parenLevel === 0) {
        parts.push(current);
        current = '';
        continue;
      }
      current += char;
    }
    
    if (current) parts.push(current);
    return parts;
  }

  // Resolve an expression to its result type
  private resolveType(expr: string, variables: Record<string, string>): string | null {
    // Direct variable or path lookup
    if (variables[expr]) return variables[expr];
    if (this.index.completions[expr]) return expr;
    
    const parts = this.parsePath(expr);
    if (!parts.length) return null;
    
    // Start with first part
    let path = variables[parts[0]] || parts[0];
    
    // Process parts after first
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      const methodName = part.indexOf('(') > -1 ? part.substring(0, part.indexOf('(')) : part;
      const fullPath = `${path}.${methodName}`;
      
      path = part.indexOf('(') > -1 
        ? this.index.returns[fullPath] || null  // Method call - lookup return type
        : fullPath;                            // Path component - extend path
        
      if (!path) return null;
    }
    
    return path;
  }

  // Find all variables in code
  private findVariables(code: string): Record<string, string> {
    const variables = {};
    const pattern = /^\s*(\w+)\s*=\s*(.+?)(?:$|#)/;
    
    code.split('\n').forEach(line => {
      const match = line.match(pattern);
      if (!match) return;
      
      const type = this.resolveType(match[2].trim(), variables);
      if (type) variables[match[1]] = type;
    });
    
    return variables;
  }

  // Create the completion extension
  createCompletionExtension() {
    return pythonLanguage.data.of({
      autocomplete: (context: CompletionContext) => {
        const code = context.state.doc.toString();
        const variables = this.findVariables(code);
        
        // Dot completion
        const dotMatch = context.matchBefore(/(\w+(?:\.\w+(?:\([^)]*\))?)*)\.(\w*)$/);
        if (dotMatch && (context.explicit || dotMatch.from !== dotMatch.to)) {
          const lastDot = dotMatch.text.lastIndexOf('.');
          const beforeDot = dotMatch.text.substring(0, lastDot);
          const afterDot = dotMatch.text.substring(lastDot + 1);
          const from = dotMatch.to - afterDot.length;
          
          // Get completions path
          const path = this.resolveType(beforeDot, variables);
          if (!path || !this.index.completions[path]) return null;
          
          // Filter and return completions
          const completions = this.index.completions[path];
          return {
            from,
            options: afterDot
              ? completions.filter(item => 
                  item.label.toLowerCase().startsWith(afterDot.toLowerCase()))
              : completions
          };
        }
        
        // Word completion
        const wordMatch = context.matchBefore(/\b(\w+)$/);
        if (wordMatch && (context.explicit || wordMatch.text.length > 0)) {
          const word = wordMatch.text.toLowerCase();
          
          const options = [
            // Root modules
            ...Object.keys(this.index.completions)
              .filter(path => !path.includes('.') && path.toLowerCase().startsWith(word))
              .map(name => ({ label: name, type: "module" as const })),
            
            // Variables
            ...Object.entries(variables)
              .filter(([name]) => name.toLowerCase().startsWith(word))
              .map(([name, type]) => ({ 
                label: name, 
                type: "variable" as const, 
                info: `Type: ${type}` 
              }))
          ];
          
          if (options.length) return { from: wordMatch.from, options };
        }
        
        return null;
      }
    });
  }
}