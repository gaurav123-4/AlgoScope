import React, { useState } from 'react'
import CodeEditor from './CodeEditor'

const PracticePage = () => {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Write your algorithm here...\n')

  const languages = [
    {
      label: 'JavaScript',
      value: 'javascript',
      default: '// Write your algorithm here...\n',
    },
    {
      label: 'Python',
      value: 'python',
      default: '# Write your algorithm here...\n',
    },
    {
      label: 'Java',
      value: 'java',
      default:
        'public class Main {\n  public static void main(String[] args) {\n    // Write your algorithm here...\n  }\n}\n',
    },
    {
      label: 'C++',
      value: 'cpp',
      default:
        '#include <iostream>\n\nint main() {\n  // Write your algorithm here...\n  return 0;\n}\n',
    },
  ]

  const handleLanguageChange = (e) => {
    const selectedLang = languages.find((lang) => lang.value === e.target.value)
    setLanguage(selectedLang.value)
    setCode(selectedLang.default)
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#020617] text-white p-4 md:p-6">
      <div className="max-w-full mx-auto px-2 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Practice Code</h1>
          <p className="text-slate-400">
            Hone your algorithm skills by writing code in your favorite
            language.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls Panel */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <label className="block text-sm font-semibold text-slate-400 mb-2">
                Select Language
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <ul className="text-sm text-slate-400 space-y-2 list-disc pl-4">
                <li>Select your preferred programming language.</li>
                <li>Write your algorithm or code snippet in the editor.</li>
                <li>
                  The editor supports syntax highlighting and basic
                  autocompletion.
                </li>
                <li>
                  (Coming Soon) Run and test your code directly in the browser!
                </li>
              </ul>
            </div>
          </div>

          {/* Editor Panel */}
          <div className="flex-grow">
            <CodeEditor
              language={language}
              defaultCode={code}
              onCodeChange={handleCodeChange}
              key={language} // Reset editor when language changes
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticePage
