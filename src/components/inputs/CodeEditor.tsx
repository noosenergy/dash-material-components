import React, {useState, useEffect, useCallback} from 'react';
import {Box} from '@mui/material';
import {DashComponentProps} from 'props';

// Check if optional dependencies are available
let CodeMirror: unknown = null;
let python: unknown = null;
let vscodeLight: unknown = null;
let vscodeDark: unknown = null;
let indentUnit: unknown = null;
let EditorState: unknown = null;
let AutocompleteManager: unknown = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  CodeMirror = require('@uiw/react-codemirror').default;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  python = require('@codemirror/lang-python').python;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const themes = require('@uiw/codemirror-theme-vscode');
  vscodeLight = themes.vscodeLight;
  vscodeDark = themes.vscodeDark;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  indentUnit = require('@codemirror/language').indentUnit;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  EditorState = require('@codemirror/state').EditorState;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const autocomplete = require('../../fragments/CodeEditorAutocomplete');
  AutocompleteManager = autocomplete.AutocompleteManager;
} catch (error) {
  // Don't set any values, let the component throw an error when used
}

/**
 * Code Editor component with configurable Python module autocompletion.
 *
 * This component requires optional CodeMirror dependencies for full functionality.
 * When dependencies are not installed, it will throw an error.
 *
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
  moduleDefinitions = {},
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
  const handleChange = useCallback(
    (newValue: string) => {
      if (setProps) {
        setProps({value: newValue});
      }
    },
    [setProps]
  );

  // If CodeMirror dependencies are not available, throw an error
  if (!CodeMirror || !python || !vscodeLight || !vscodeDark) {
    throw new Error(
      'CodeEditor component unavailable.\n' +
        'Requires dash-material-components to be built with the necessary optional CodeMirror dependencies.\n\n' +
        'In dash-material-components package: \n' +
        '   - yarn install --frozen-lockfile \n' +
        '   - yarn build'
    );
  }

  // Create autocomplete manager
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteManager = new (AutocompleteManager as any)(moduleDefinitions);

  // Configure extensions with custom completions
  const extensions = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (python as any)(),
    autocompleteManager.createCompletionExtension(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (indentUnit as any).of(' '.repeat(tabSize)), // Set tab size
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (EditorState as any).tabSize.of(tabSize) // Set tab size for tab character
  ];

  return (
    <Box id={id} m={margin} width={width} height={height}>
      {editorLoaded ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.createElement(CodeMirror as React.ComponentType<any>, {
          value,
          height,
          width,
          theme: darkTheme ? vscodeDark : vscodeLight,
          extensions,
          onChange: handleChange,
          readOnly,
          basicSetup: {
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
            lintKeymap: true
          }
        })
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
  moduleDefinitions?: Record<string, unknown>;
} & DashComponentProps;

// Re-export types from Autocomplete for external use
export type {ModuleDefinition, CompletionItem} from '../../fragments/CodeEditorAutocomplete';
export default CodeEditor;
