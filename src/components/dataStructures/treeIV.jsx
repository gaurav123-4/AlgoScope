import { useState } from 'react'
import { animate } from 'animejs'

class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.x = 0
    this.y = 0
  }
}

function deepCloneTree(node) {
  if (!node) return null
  const clone = new TreeNode(node.value)
  clone.x = node.x
  clone.y = node.y
  if (node.left) clone.left = deepCloneTree(node.left)
  if (node.right) clone.right = deepCloneTree(node.right)
  return clone
}

export default function TreeIV() {
  const [root, setRoot] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [treeStructure, setTreeStructure] = useState([])
  const [edges, setEdges] = useState([])

  const updateTreePositions = (node, x, y, level) => {
    if (!node) return { nodes: [], edges: [] }
    const gap = Math.max(40, 120 / level)
    node.x = x
    node.y = y

    let nodes = [{ ...node, left: null, right: null }]
    let edgeList = []

    if (node.left) {
      const leftResult = updateTreePositions(
        node.left,
        x - gap,
        y + 80,
        level + 1
      )
      nodes = [...nodes, ...leftResult.nodes]
      edgeList = [...edgeList, ...leftResult.edges]
      edgeList.push({
        fromX: x,
        fromY: y,
        toX: node.left.x,
        toY: node.left.y,
      })
    }

    if (node.right) {
      const rightResult = updateTreePositions(
        node.right,
        x + gap,
        y + 80,
        level + 1
      )
      nodes = [...nodes, ...rightResult.nodes]
      edgeList = [...edgeList, ...rightResult.edges]
      edgeList.push({
        fromX: x,
        fromY: y,
        toX: node.right.x,
        toY: node.right.y,
      })
    }

    return { nodes, edges: edgeList }
  }

  const insertNode = () => {
    const val = parseInt(inputValue)
    if (isNaN(val)) return

    const newNode = new TreeNode(val)
    let currentRoot = root ? deepCloneTree(root) : null

    if (!currentRoot) {
      currentRoot = newNode
    } else {
      let curr = currentRoot
      while (true) {
        if (val < curr.value) {
          if (!curr.left) {
            curr.left = newNode
            break
          }
          curr = curr.left
        } else {
          if (!curr.right) {
            curr.right = newNode
            break
          }
          curr = curr.right
        }
      }
    }

    const { nodes, edges: newEdges } = updateTreePositions(
      currentRoot,
      400,
      50,
      1
    )
    setRoot(currentRoot)
    setTreeStructure(nodes)
    setEdges(newEdges)
    setInputValue('')

    setTimeout(() => {
      animate(`.node-${val}`, {
        scale: [0, 1],
        opacity: [0, 1],
        duration: 800,
        ease: 'outElastic(1, .6)',
      })
    }, 50)
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex gap-4 mb-4 justify-center z-20">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Node Value"
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-purple-500 transition-colors w-32"
          onKeyDown={(e) => e.key === 'Enter' && insertNode()}
        />
        <button
          onClick={insertNode}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          Insert
        </button>
        <button
          onClick={() => {
            setRoot(null)
            setTreeStructure([])
            setEdges([])
          }}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all active:scale-95"
        >
          Clear
        </button>
      </div>

      <div className="relative flex-1 overflow-auto bg-slate-900/20 rounded-xl border border-white/5">
        {treeStructure.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            Enter a value and click Insert to add nodes
          </div>
        ) : (
          <>
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
              {edges.map((edge, index) => (
                <line
                  key={index}
                  x1={edge.fromX + 24}
                  y1={edge.fromY + 24}
                  x2={edge.toX + 24}
                  y2={edge.toY + 24}
                  stroke="#475569"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {treeStructure.map((node) => (
              <div
                key={node.value}
                className={`node-${node.value} absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white/20 shadow-xl z-10`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
              >
                {node.value}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
