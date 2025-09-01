// src/components/CodeEditor.tsx
import React, {memo, Suspense} from 'react';
import {asyncDecorator} from '@plotly/dash-component-plugins';
import codeeditor from '../../utils/LazyLoader/CodeEditor';
import type {ModuleDefinition, CompletionItem} from '../../fragments/CodeEditorAutocomplete';
import {DashComponentProps} from 'props';

type CodeEditorPropsType = {
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
  moduleDefinitions?: ModuleDefinition;
} & DashComponentProps;

// Main component (gets exported)
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
}: CodeEditorPropsType) => {
  return (
    <ControlledCodeEditor
      id={id}
      value={value}
      height={height}
      width={width}
      margin={margin}
      readOnly={readOnly}
      lineNumbers={lineNumbers}
      tabSize={tabSize}
      highlightActiveLine={highlightActiveLine}
      darkTheme={darkTheme}
      moduleDefinitions={moduleDefinitions}
      setProps={setProps}
    />
  );
};

// Async-decorated version (internal)
const RealCodeEditor = asyncDecorator(CodeEditor, () =>
  Promise.all([codeeditor()]).then(([codeeditor]) => codeeditor)
);

// Controlled version with Suspense (internal)
const ControlledCodeEditor = memo<CodeEditorPropsType>((props) => {
  const {id, className} = props;

  const extendedClassName = className ? 'dash-code-editor ' + className : 'dash-code-editor';

  return (
    <Suspense
      fallback={
        <div id={id} key={id} className={`${extendedClassName} dash-code-editor--pending`}>
          Loading code editor...
        </div>
      }
    >
      <RealCodeEditor {...props} className={extendedClassName} />
    </Suspense>
  );
});

// Mandatory for memoization debugging
ControlledCodeEditor.displayName = 'ControlledCodeEditor';

// Export the original component AND the types AND the default props
export default CodeEditor;
export type {CodeEditorPropsType};
export type {ModuleDefinition, CompletionItem};
