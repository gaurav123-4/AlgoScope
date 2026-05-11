import React, { useState } from 'react'
import Editor from '@monaco-editor/react'

const CodeEditor = ({
  language = 'javascript',
  defaultCode = '// Write your algorithm here...\n',
  onCodeChange,
}) => {
  const [value, setValue] = useState(defaultCode)

  // This runs every time the user types in the editor
  const handleEditorChange = (newValue) => {
    setValue(newValue)
    // Pass the code up to the parent component so we can execute it later
    if (onCodeChange) {
      onCodeChange(newValue)
    }
  }

  return (
    <div className="flex flex-col w-full h-[700px] border border-gray-700 rounded-lg overflow-hidden bg-[#1e1e1e]">
      {/* Editor Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 text-sm font-semibold text-gray-400">
            {language === 'javascript' ? 'main.js' : `main.${language}`}
          </span>
        </div>

        {/* Placeholder for the Run Button */}
        <button className="px-4 py-1 text-sm font-bold text-white transition-colors bg-green-600 rounded hover:bg-green-500">
          Run Code
        </button>
      </div>

      {/* The Actual Monaco Editor */}
      <div className="flex-grow pt-2">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark" /* Classic VS Code Dark Theme */
          value={value}
          onChange={handleEditorChange}
          options={{
            minimap: {
              enabled: false,
            } /* Hides the right-side minimap to save space */,
            fontSize: 14,
            fontFamily:
              "'JetBrains Mono', monospace" /* Uses the font we discussed earlier! */,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10 },
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor
