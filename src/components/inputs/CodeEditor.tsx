import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { DashComponentProps } from 'props';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeLight, vscodeDark } from '@uiw/codemirror-theme-vscode';
import { AutocompleteManager, ModuleDefinition, CompletionItem } from '../../fragments/Autocomplete';
import { indentUnit } from '@codemirror/language';
import { EditorState } from '@codemirror/state';

/**
 * Code Editor component with configurable Python module autocompletion.
 */
const CodeEditor = ({
  id = 'code-editor',
  value = '',
  height = '400px',
  width = '100%',
  margin = 2,
  readOnly = false,
  lineNumbers = true,
  tabSize = 2,
  highlightActiveLine = true,
  darkTheme = false,
  moduleDefinitions = [],
  setProps
}: CodeEditorProps) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  
  // Check if we're in the browser environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEditorLoaded(true);
    }
  }, []);
  
  // Handle changes
  const handleChange = useCallback((newValue: string) => {
    if (setProps) {
      setProps({ value: newValue });
    }
  }, [setProps]);

  // Create autocomplete manager
  const autocompleteManager = new AutocompleteManager(moduleDefinitions);
  
  // Configure extensions with custom completions
  const extensions = [
    python(),
    autocompleteManager.createCompletionExtension(),
    indentUnit.of(" ".repeat(tabSize)), // Set tab size
    EditorState.tabSize.of(tabSize)     // Set tab size for tab character
  ];

  return (
    <Box id={id} m={margin} width={width} height={height}>
      {editorLoaded ? (
        <CodeMirror
          value={value}
          height={height}
          width={width}
          theme={darkTheme ? vscodeDark : vscodeLight}
          extensions={extensions}
          onChange={handleChange}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      ) : (
        // Box fallback
        <Box bgcolor={darkTheme ? '#1E1E1E' : '#FFFFFF'} p={1}>
          {value || 'Loading editor...'}
        </Box>
      )}
    </Box>
  );
};

// Add the moduleDefinitions type to our props
type CodeEditorProps = {
  /** The initial value of the editor */
  value?: string;
  /** The height of the editor */
  height?: string;
  /** The width of the editor */
  width?: string;
  /** Margin around the editor */
  margin?: string | number;
  /** If true, the editor will be read-only */
  readOnly?: boolean;
  /** If true, shows line numbers */
  lineNumbers?: boolean;
  /** Number of spaces for tabs */
  tabSize?: number;
  /** If true, the active line will be highlighted */
  highlightActiveLine?: boolean;
  /** If true, use dark theme instead of light theme */
  darkTheme?: boolean;
  /** Module definitions for code completion */
  moduleDefinitions?: ModuleDefinition[];
} & DashComponentProps;

// Re-export types from Autocomplete for external use
export type { ModuleDefinition, CompletionItem };
export default CodeEditor;