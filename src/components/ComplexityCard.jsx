import React from 'react'
import { complexityMap } from '../data/complexityMap'

const ComplexityCard = ({ algorithm }) => {
  if (!algorithm || !complexityMap[algorithm]) return null

  const current = complexityMap[algorithm]

  return (
    <div className="mt-4 bg-slate-950/70 border border-slate-700 rounded-xl p-4">
      <h2 className="text-cyan-400 font-bold text-lg mb-4">
        Complexity Analysis
      </h2>

      {/* Time Complexity */}
      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-1">Time Complexity</p>

        <p className="text-white font-semibold text-sm break-words">
          {current.time}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700 my-3"></div>

      {/* Space Complexity */}
      <div>
        <p className="text-slate-400 text-sm mb-1">Space Complexity</p>

        <p className="text-white font-semibold text-sm break-words">
          {current.space}
        </p>
      </div>
    </div>
  )
}

export default ComplexityCard
