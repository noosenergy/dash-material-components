// Check if optional dependencies are available
let CompletionContext: unknown = null;
let pythonLanguage: unknown = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CompletionContext = require('@codemirror/autocomplete').CompletionContext;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  pythonLanguage = require('@codemirror/lang-python').pythonLanguage;
} catch (error) {
  // Don't set any values, let the component throw an error when used
}

export interface CompletionItem {
  label: string;
  type:
    | 'class'
    | 'function'
    | 'method'
    | 'property'
    | 'variable'
    | 'module'
    | 'attribute'
    | 'object';
  info?: string;
  returns?: string;
  items?: Record<string, CompletionItem>;
}

// Define individual module type
export interface ModuleDefinition {
  [moduleName: string]: {
    importName?: string;
    items: Record<string, CompletionItem>;
  };
}

export class AutocompleteManager {
  // Single map for completions, type, and return types
  // The idea is to have flat records allowing fast and simple look-ups
  private index = {
    completions: {} as Record<string, CompletionItem[]>,
    returns: {} as Record<string, string>,
    type: {} as Record<string, string>
  };

  constructor(moduleDefinitions: ModuleDefinition) {
    this.buildIndex(moduleDefinitions);
  }

  // Build index from module definitions
  private buildIndex(moduleDefinition: ModuleDefinition): void {
    Object.entries(moduleDefinition).forEach(([moduleName, moduleData]) => {
      this.indexModule(moduleName, moduleData.items);
    });
  }

  // Index a module and its items recursively
  private indexModule(path: string, items: Record<string, CompletionItem>): void {
    // Index current path completions
    this.index.completions[path] = this.mapItems(items);

    // Process each item
    Object.entries(items).forEach(([name, data]) => {
      const itemPath = `${path}.${name}`;

      // Store the item's type and return type
      this.index.type[itemPath] = data.type;
      if (data.returns) this.index.returns[itemPath] = data.returns;

      // Process nested items
      if (data.items) {
        // Index methods for classes
        if (data.type === 'class') this.index.completions[itemPath] = this.mapItems(data.items);

        // Process submodules
        if (data.type === 'module') this.indexModule(itemPath, data.items);

        // Store method return types
        this.mapReturnTypes(itemPath, data.items);
      }
    });
  }

  // Map items to completion items
  private mapItems(items: Record<string, CompletionItem>): CompletionItem[] {
    return Object.entries(items).map(([name, data]) => ({
      label: name,
      type: data.type,
      info: data.info,
      returns: data.returns
    }));
  }

  // Store return types for methods
  private mapReturnTypes(basePath: string, items: Record<string, CompletionItem>): void {
    Object.entries(items).forEach(([name, data]) => {
      this.index.type[`${basePath}.${name}`] = data.type;
      if (data.returns) this.index.returns[`${basePath}.${name}`] = data.returns;
    });
  }

  // Parse the path using dot separator, handle cases with parentheses
  private parsePath(expr: string): string[] {
    const parts = [];
    let current = '';
    let parenLevel = 0;
    let last_trigger = '';

    for (let i = 0; i < expr.length; i++) {
      const char = expr.charAt(i);
      if (char === '(') {
        if (last_trigger === ')' && parenLevel === 0) {
          // Start of call case! new part starting with __call__
          parts.push(current);
          current = '__call__';
        }
        parenLevel++;
        last_trigger = '(';
      } else if (char === ')') {
        parenLevel--;
        last_trigger = ')';
      } else if (char === '.' && parenLevel === 0) {
        parts.push(current);
        current = '';
        last_trigger = '';
        continue;
      }
      current += char;
    }

    if (current) parts.push(current);

    return parts;
  }

  // Resolve an expression to its result type
  private resolveType(expr: string, variables: Record<string, string>): string | null {
    const ObjectTypes: string[] = ['object', 'attribute', 'property'];

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
      const member_type = this.index.type[fullPath] || null;

      if (member_type == 'module') {
        path = fullPath || null;
      } else if (member_type == 'class') {
        path = fullPath || null;
      } else if (member_type === 'function') {
        // catch function case, need to always ends with parenthesis
        if (part.endsWith(')')) {
          path = this.index.returns[fullPath] || null;
        } else {
          path = null;
        }
      } else if (part.endsWith(')') && ObjectTypes.includes(member_type)) {
        // catch class instance call case
        const object_type = this.index.returns[fullPath] || null;
        path = this.index.returns[`${object_type}.__call__`] || null;
      } else {
        path = this.index.returns[fullPath] || null;
      }
    }

    return path;
  }

  // Find all variables in code
  private findVariables(code: string): Record<string, string> {
    const variables = {};
    const pattern = /^\s*(\w+)\s*=\s*(.+?)(?:$|#)/;

    code.split('\n').forEach((line) => {
      const match = line.match(pattern);
      if (!match) return;

      const type = this.resolveType(match[2].trim(), variables);
      if (type) variables[match[1]] = type;
    });

    return variables;
  }

  // Create the completion extension
  createCompletionExtension() {
    // If dependencies are not available, throw an error
    if (!pythonLanguage || !CompletionContext) {
      throw new Error(
        'CodeEditor autocomplete requires optional CodeMirror dependencies. ' +
          'Please install them with: yarn add @codemirror/autocomplete @codemirror/lang-python'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (pythonLanguage as any).data.of({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      autocomplete: (context: any) => {
        const code = context.state.doc.toString();
        const variables = this.findVariables(code);

        // Dot completion
        const dotMatch = context.matchBefore(/(\w+(?:\.\w+(?:\([^)]*\))*)*)\.(\w*)$/);
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
              ? Object.values(completions).filter((item) =>
                  item.label?.toLowerCase().startsWith(afterDot.toLowerCase())
                )
              : Object.values(completions)
          };
        }

        // Word completion
        const wordMatch = context.matchBefore(/\b(\w+)$/);
        if (wordMatch && (context.explicit || wordMatch.text.length > 0)) {
          const word = wordMatch.text.toLowerCase();

          const options = [
            // Root modules
            ...Object.keys(this.index.completions)
              .filter((path) => !path.includes('.') && path.toLowerCase().startsWith(word))
              .map((name) => ({label: name, type: 'module' as const})),

            // Variables
            ...Object.entries(variables)
              .filter(([name]) => name.toLowerCase().startsWith(word))
              .map(([name, type]) => ({
                label: name,
                type: 'variable' as const,
                info: `Type: ${type}`
              }))
          ];

          if (options.length) return {from: wordMatch.from, options};
        }

        return null;
      }
    });
  }
}
