// src/fragments/CodeEditor.tsx
import React, {useState, useEffect, useCallback} from 'react';
import {Box} from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
import {vscodeLight, vscodeDark} from '@uiw/codemirror-theme-vscode';
import {AutocompleteManager} from './CodeEditorAutocomplete';
import {indentUnit} from '@codemirror/language';
import {EditorState} from '@codemirror/state';

// Import props from component wrapper
import type {CodeEditorPropsType} from '../components/inputs/CodeEditor';

const CodeEditor: React.FC<CodeEditorPropsType> = ({
  id,
  value,
  height,
  width,
  margin,
  readOnly,
  lineNumbers,
  tabSize,
  highlightActiveLine,
  darkTheme,
  moduleDefinitions,
  setProps
}) => {
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

  // Create autocomplete manager
  const autocompleteManager = new AutocompleteManager(moduleDefinitions);

  // Configure extensions with custom completions
  const extensions = [
    python(),
    autocompleteManager.createCompletionExtension(),
    indentUnit.of(' '.repeat(tabSize)), // Set tab size
    EditorState.tabSize.of(tabSize) // Set tab size for tab character
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
            lintKeymap: true
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

export default CodeEditor;
