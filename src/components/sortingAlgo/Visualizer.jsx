import React, { useState, useRef, useEffect } from 'react'
import { CodeDisplay } from './CodeDisplay'
import SpeedSlider from '../SpeedSlider.jsx'
import CodePanel from '../visualizer/CodePanel'
import { useStepPlayback } from '../visualizer/useStepPlayback'
import {
  getBubbleSortSource,
  generateBubbleSortSteps,
  resolveBubbleSortLine,
} from '../../algorithms/sorting/bubbleSortSteps'

const CountArrayDisplay = ({ title, data, barWidth = 20 }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
    <div
      className="flex gap-2 items-end h-[300px] p-4 rounded-xl border border-slate-700"
      style={{ background: 'rgba(15, 23, 42, 0.5)' }}
    >
      {data.map((value, idx) => (
        <div
          key={idx}
          className="count-bar rounded transition-all duration-500 border border-slate-600"
          style={{
            height: `${value * 20}px`,
            width: `${barWidth}px`,
            background: '#06b6d4',
            position: 'relative',
          }}
        >
          <div className="count-val">{value}</div>
        </div>
      ))}
    </div>
  </div>
)

const createRandomArray = () =>
  Array.from({ length: 8 }, () => Math.floor(Math.random() * 200) + 50)

export default function Visualizer({ algorithmType }) {
  const [array, setArray] = useState([50, 120, 70, 30, 200, 90, 160])
  const [isSorting, setIsSorting] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('')
  const [countArray, setCountArray] = useState([])
  const [radixCountArray, setRadixCountArray] = useState([])
  const [currentRadixDigit, setCurrentRadixDigit] = useState(1)
  const [speed, setSpeed] = useState(1)
  const [bubbleLanguage, setBubbleLanguage] = useState('javascript')
  const barsRef = useRef([])
  const eleRef = useRef([])
  const {
    currentStep: bubbleStep,
    currentStepIndex: bubbleStepIndex,
    steps: bubbleSteps,
    hasSteps: hasBubbleSteps,
    isComplete: isBubbleComplete,
    isPlaying: isBubblePlaying,
    loadSteps: loadBubbleSteps,
    clear: clearBubblePlayback,
    pause: pauseBubblePlayback,
    play: playBubblePlayback,
    replay: replayBubblePlayback,
    stepForward: stepBubbleForward,
  } = useStepPlayback({ speed })

  // ... (keep existing state and logic until return) ...

  useEffect(() => {
    barsRef.current = document.querySelectorAll('.bar')
    eleRef.current = document.querySelectorAll('.array-ele')
  }, [array])

  useEffect(() => {
    if (selectedAlgorithm === 'bubble' && bubbleStep?.array) {
      setArray(bubbleStep.array)
    }
  }, [bubbleStep, selectedAlgorithm])

  const sleep = (ms) =>
    new Promise((r) => setTimeout(r, Math.max(0, ms / speed)))

  const updateArrayAndVisuals = (newArray, index1, index2) => {
    setArray([...newArray])
    if (barsRef.current[index1] && barsRef.current[index2]) {
      const tempHeight = barsRef.current[index1].style.height
      barsRef.current[index1].style.height =
        barsRef.current[index2].style.height
      barsRef.current[index2].style.height = tempHeight
    }
  }

  const updateElementHeight = (index, value) => {
    if (barsRef.current[index]) {
      barsRef.current[index].style.height = `${value}px`
    }
  }

  const highlight = (i, j, className = 'active') => {
    if (barsRef.current[i]) barsRef.current[i].classList.add(className)
    if (barsRef.current[j]) barsRef.current[j].classList.add(className)
    if (eleRef.current[i]) eleRef.current[i].classList.add(className)
    if (eleRef.current[j]) eleRef.current[j].classList.add(className)
  }

  const dehighlight = (i, j, className = 'active') => {
    if (barsRef.current[i]) barsRef.current[i].classList.remove(className)
    if (barsRef.current[j]) barsRef.current[j].classList.remove(className)
    if (eleRef.current[i]) eleRef.current[i].classList.remove(className)
    if (eleRef.current[j]) eleRef.current[j].classList.remove(className)
  }

  const clearDynamicArrays = () => {
    setCountArray([])
    setRadixCountArray([])
  }

  // --- Sorting Algorithms ---
  const selectionSort = async () => {
    setIsSorting(true)
    let arr = [...array]
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i
      highlight(i, i, 'pivot')
      for (let j = i + 1; j < arr.length; j++) {
        highlight(j, j, 'active')
        await sleep(300)
        if (arr[j] < arr[minIdx]) {
          if (minIdx !== i) dehighlight(minIdx, minIdx, 'min')
          minIdx = j
          highlight(minIdx, minIdx, 'min')
        }
        dehighlight(j, j, 'active')
      }
      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        updateArrayAndVisuals(arr, i, minIdx)
      }
      dehighlight(i, i, 'pivot')
      dehighlight(minIdx, minIdx, 'min')
      await sleep(200)
    }
    setIsSorting(false)
  }

  const insertionSort = async () => {
    setIsSorting(true)
    let arr = [...array]
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i]
      let j = i - 1
      highlight(i, i, 'pivot')
      await sleep(300)
      while (j >= 0 && arr[j] > key) {
        highlight(j, j + 1)
        await sleep(300)
        arr[j + 1] = arr[j]
        updateElementHeight(j + 1, arr[j])
        setArray([...arr])
        dehighlight(j, j + 1)
        j--
      }
      arr[j + 1] = key
      updateElementHeight(j + 1, key)
      setArray([...arr])
      dehighlight(i, i, 'pivot')
    }
    setIsSorting(false)
  }

  const quickSort = async (
    arr = [...array],
    low = 0,
    high = arr.length - 1,
    isInitial = true
  ) => {
    if (isInitial) {
      setIsSorting(true)
      arr = [...array]
    }
    if (low < high) {
      let pi = await partition(arr, low, high)
      await quickSort(arr, low, pi - 1, false)
      await quickSort(arr, pi + 1, high, false)
    }
    if (isInitial) setIsSorting(false)
    return arr
  }

  const partition = async (arr, low, high) => {
    let pivot = arr[high]
    let i = low - 1
    if (barsRef.current[high]) barsRef.current[high].classList.add('pivot')
    if (eleRef.current[high]) eleRef.current[high].classList.add('pivot')

    for (let j = low; j < high; j++) {
      if (barsRef.current[j]) barsRef.current[j].classList.add('active')
      if (eleRef.current[j]) eleRef.current[j].classList.add('active')
      await sleep(300)

      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          updateArrayAndVisuals(arr, i, j)
        }
      }
      if (barsRef.current[j]) barsRef.current[j].classList.remove('active')
      if (eleRef.current[j]) eleRef.current[j].classList.remove('active')
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    updateArrayAndVisuals(arr, i + 1, high)

    if (barsRef.current[high]) barsRef.current[high].classList.remove('pivot')
    if (eleRef.current[high]) eleRef.current[high].classList.remove('pivot')
    return i + 1
  }

  const mergeSort = async (
    arr = [...array],
    left = 0,
    right = arr.length - 1,
    isInitial = true
  ) => {
    if (isInitial) {
      setIsSorting(true)
      arr = [...array]
    }
    if (left < right) {
      let mid = Math.floor((left + right) / 2)
      await mergeSort(arr, left, mid, false)
      await mergeSort(arr, mid + 1, right, false)
      await merge(arr, left, mid, right)
    }
    if (isInitial) setIsSorting(false)
    return arr
  }

  const merge = async (arr, left, mid, right) => {
    let leftArr = arr.slice(left, mid + 1)
    let rightArr = arr.slice(mid + 1, right + 1)
    let i = 0,
      j = 0,
      k = left

    while (i < leftArr.length && j < rightArr.length) {
      if (barsRef.current[k]) barsRef.current[k].classList.add('active')
      if (eleRef.current[k]) eleRef.current[k].classList.add('active')
      await sleep(300)

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        i++
      } else {
        arr[k] = rightArr[j]
        j++
      }
      updateElementHeight(k, arr[k])
      setArray([...arr])
      if (barsRef.current[k]) barsRef.current[k].classList.remove('active')
      if (eleRef.current[k]) eleRef.current[k].classList.remove('active')
      k++
    }
    while (i < leftArr.length) {
      /* ... copy rest ... */
    }
    while (j < rightArr.length) {
      /* ... copy rest ... */
    }
  }

  const heapSort = async () => {
    setIsSorting(true)
    let arr = [...array]
    let n = arr.length
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i)
    }
    for (let i = n - 1; i > 0; i--) {
      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      updateArrayAndVisuals(arr, 0, i)
      await sleep(300)
      await heapify(arr, i, 0)
    }
    setIsSorting(false)
  }

  const heapify = async (arr, n, i) => {
    let largest = i
    let left = 2 * i + 1
    let right = 2 * i + 2

    if (barsRef.current[i]) barsRef.current[i].classList.add('pivot')
    if (eleRef.current[i]) eleRef.current[i].classList.add('pivot')

    if (left < n && arr[left] > arr[largest]) largest = left
    if (right < n && arr[right] > arr[largest]) largest = right

    if (largest !== i) {
      if (barsRef.current[largest])
        barsRef.current[largest].classList.add('active')
      if (eleRef.current[largest])
        eleRef.current[largest].classList.add('active')
      await sleep(300)
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      updateArrayAndVisuals(arr, i, largest)
      if (barsRef.current[largest])
        barsRef.current[largest].classList.remove('active')
      if (eleRef.current[largest])
        eleRef.current[largest].classList.remove('active')
      if (barsRef.current[i]) barsRef.current[i].classList.remove('pivot')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('pivot')
      await heapify(arr, n, largest)
    } else {
      if (barsRef.current[i]) barsRef.current[i].classList.remove('pivot')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('pivot')
    }
  }

  const countingSort = async () => {
    setIsSorting(true)
    clearDynamicArrays()
    let arr = [...array]
    const max = Math.max(...arr)
    const count = new Array(max + 1).fill(0)

    setCountArray([...count])
    await sleep(200)

    for (let i = 0; i < arr.length; i++) {
      if (barsRef.current[i]) barsRef.current[i].classList.add('active')
      if (eleRef.current[i]) eleRef.current[i].classList.add('active')

      count[arr[i]]++
      setCountArray([...count])
      await sleep(300)

      if (barsRef.current[i]) barsRef.current[i].classList.remove('active')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('active')
    }

    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1]
      setCountArray([...count])
      await sleep(200)
    }

    const output = new Array(arr.length)
    for (let i = arr.length - 1; i >= 0; i--) {
      if (barsRef.current[i]) barsRef.current[i].classList.add('active')
      if (eleRef.current[i]) eleRef.current[i].classList.add('active')

      output[count[arr[i]] - 1] = arr[i]
      count[arr[i]]--
      setCountArray([...count])
      await sleep(300)

      if (barsRef.current[i]) barsRef.current[i].classList.remove('active')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('active')
    }

    for (let i = 0; i < arr.length; i++) {
      if (barsRef.current[i]) barsRef.current[i].classList.add('active')
      if (eleRef.current[i]) eleRef.current[i].classList.add('active')

      arr[i] = output[i]
      updateElementHeight(i, arr[i])
      setArray([...arr])
      await sleep(300)

      if (barsRef.current[i]) barsRef.current[i].classList.remove('active')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('active')
    }

    setTimeout(clearDynamicArrays, 1000)
    setIsSorting(false)
  }

  const radixSort = async () => {
    setIsSorting(true)
    clearDynamicArrays()
    let arr = [...array]
    let max = Math.max(...arr)

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      setCurrentRadixDigit(exp)
      await countingSortForRadix(arr, exp)
    }

    setTimeout(clearDynamicArrays, 500)
    setIsSorting(false)
  }

  const countingSortForRadix = async (arr, exp) => {
    let output = new Array(arr.length)
    let count = new Array(10).fill(0)

    setRadixCountArray([...count])
    await sleep(200)

    for (let i = 0; i < arr.length; i++) {
      if (barsRef.current[i]) barsRef.current[i].classList.add('active')
      if (eleRef.current[i]) eleRef.current[i].classList.add('active')

      const digit = Math.floor(arr[i] / exp) % 10
      count[digit]++
      setRadixCountArray([...count])
      await sleep(200)

      if (barsRef.current[i]) barsRef.current[i].classList.remove('active')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('active')
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1]
      setRadixCountArray([...count])
      await sleep(100)
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      if (barsRef.current[i]) barsRef.current[i].classList.add('active')
      if (eleRef.current[i]) eleRef.current[i].classList.add('active')

      const digit = Math.floor(arr[i] / exp) % 10
      output[count[digit] - 1] = arr[i]
      count[digit]--
      setRadixCountArray([...count])
      await sleep(300)

      if (barsRef.current[i]) barsRef.current[i].classList.remove('active')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('active')
    }

    for (let i = 0; i < arr.length; i++) {
      if (barsRef.current[i]) barsRef.current[i].classList.add('active')
      if (eleRef.current[i]) eleRef.current[i].classList.add('active')

      arr[i] = output[i]
      updateElementHeight(i, arr[i])
      setArray([...arr])
      await sleep(200)

      if (barsRef.current[i]) barsRef.current[i].classList.remove('active')
      if (eleRef.current[i]) eleRef.current[i].classList.remove('active')
    }
  }

  const sortingAlgorithms = {
    selection: selectionSort,
    insertion: insertionSort,
    quick: quickSort,
    merge: mergeSort,
    heap: heapSort,
    counting: countingSort,
    radix: radixSort,
  }

  const algorithmOptions = {
    simple: ['bubble', 'selection', 'insertion'],
    complex: ['quick', 'merge', 'heap'],
    integer: ['counting', 'radix'],
  }

  const handleSort = () => {
    if (selectedAlgorithm === 'bubble') {
      clearDynamicArrays()
      loadBubbleSteps(generateBubbleSortSteps(array))
      return
    }

    if (selectedAlgorithm && sortingAlgorithms[selectedAlgorithm]) {
      clearDynamicArrays()
      clearBubblePlayback()
      sortingAlgorithms[selectedAlgorithm]()
    }
  }

  const handleReset = () => {
    clearBubblePlayback()
    setSelectedAlgorithm('')
    clearDynamicArrays()
    setArray(createRandomArray())
  }

  const isBubbleSelected = selectedAlgorithm === 'bubble'
  const isRunning = isSorting || isBubblePlaying
  const visualArray = isBubbleSelected && bubbleStep?.array ? bubbleStep.array : array
  const activeBubbleIndices = isBubbleSelected ? bubbleStep?.indices ?? [] : []
  const sortedBubbleIndices = isBubbleSelected
    ? bubbleStep?.sortedIndices ?? []
    : []
  const bubbleSource = getBubbleSortSource(bubbleLanguage)
  const activeBubbleLine = resolveBubbleSortLine(
    bubbleLanguage,
    bubbleStep?.lineKey
  )

  const getBubbleStateClass = (index) => {
    if (!isBubbleSelected) {
      return ''
    }

    if (sortedBubbleIndices.includes(index)) {
      return 'sorted'
    }

    if (activeBubbleIndices.includes(index)) {
      if (bubbleStep?.type === 'swap') {
        return 'swap'
      }

      if (bubbleStep?.type === 'compare') {
        return 'compare'
      }

      return 'active'
    }

    return ''
  }

  const handleAlgorithmChange = (event) => {
    const nextAlgorithm = event.target.value

    clearDynamicArrays()

    if (nextAlgorithm !== 'bubble') {
      clearBubblePlayback()
    }

    setSelectedAlgorithm(nextAlgorithm)
  }

  return (
    <div className="flex flex-col p-6">
      <div className="w-full">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-6 text-white tracking-tight">
            {`${algorithmType.charAt(0).toUpperCase() + algorithmType.slice(1)} Sorting`}
          </h1>

          <div className="flex flex-col items-center w-full max-w-4xl">
            <h3 className="text-lg font-semibold text-slate-300 mb-3">Array</h3>
            <div
              id="container"
              className="flex gap-2 items-end h-[300px] p-6 rounded-2xl border border-slate-700 shadow-xl w-full justify-center backdrop-blur-sm"
              style={{ background: 'rgba(30, 41, 59, 0.4)' }}
            >
              {visualArray.map((val, idx) => (
                <div
                  key={idx}
                  className={`bar rounded-t-md transition-all duration-500 border border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)] ${getBubbleStateClass(
                    idx
                  )}`}
                  style={{
                    height: `${val}px`,
                    width: '30px',
                    background: 'rgba(6, 182, 212, 0.8)',
                  }}
                >
                  <div className="bar-val">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="dynamic-containers"
            className="flex justify-center items-start gap-8 mt-6"
          >
            {countArray.length > 0 && (
              <CountArrayDisplay
                title="Count Array"
                data={countArray}
                barWidth={20}
              />
            )}
            {radixCountArray.length > 0 && (
              <CountArrayDisplay
                title={`Digit ${currentRadixDigit}s Count`}
                data={radixCountArray}
                barWidth={25}
              />
            )}
          </div>

          <div className="next p-6 flex flex-wrap gap-2 justify-center">
            {visualArray.map((item, idx) => (
              <span
                key={idx}
                className={`array-ele rounded-lg transition-all duration-300 font-mono text-sm bg-slate-800 text-cyan-400 border border-slate-600 px-3 py-2 shadow-sm ${getBubbleStateClass(
                  idx
                )}`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-4 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-300 text-center">
              Controls
            </h3>
            <div className="m-auto space-y-4">
              <div className="w-full">
                <div className="relative">
                  <select
                    value={selectedAlgorithm}
                    onChange={handleAlgorithmChange}
                    disabled={isRunning}
                    className="w-full bg-slate-900/80 text-white text-sm border border-slate-700 rounded-xl pl-4 pr-10 py-3 transition duration-300 focus:outline-none focus:border-cyan-500 hover:border-slate-600 shadow-lg appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Choose Algorithm</option>
                    {algorithmOptions[algorithmType].map((alg) => (
                      <option key={alg} value={alg}>
                        {`${alg.charAt(0).toUpperCase() + alg.slice(1)} Sort`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-4 px-4 py-2 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <SpeedSlider
                value={speed}
                onChange={(e, v) => setSpeed(v)}
                min={0.25}
                max={3}
                step={0.05}
              />
            </div>
            <div className="mt-6 gap-4 flex flex-col sm:flex-row">
              <button
                onClick={handleSort}
                disabled={isRunning || !selectedAlgorithm}
                className="flex-1 text-sm font-bold py-3 px-6 rounded-xl transition-all duration-300 bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isRunning
                  ? 'Sorting...'
                  : isBubbleSelected
                    ? 'Run Bubble Sort'
                    : 'Start Sort'}
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="flex-1 text-sm font-bold py-3 px-6 rounded-xl transition-all duration-300 bg-slate-700 text-white hover:bg-slate-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                Generate New Array
              </button>
            </div>

            {isBubbleSelected && hasBubbleSteps && (
              <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                      Playback
                    </p>
                    <p className="text-sm text-slate-300">
                      Step {bubbleStepIndex + 1} of {bubbleSteps.length}
                    </p>
                  </div>
                  <div className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-medium text-slate-200">
                    {isBubblePlaying
                      ? 'Playing'
                      : isBubbleComplete
                        ? 'Complete'
                        : 'Paused'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={
                      isBubblePlaying ? pauseBubblePlayback : playBubblePlayback
                    }
                    disabled={isBubbleComplete && !isBubblePlaying}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBubblePlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    type="button"
                    onClick={stepBubbleForward}
                    disabled={isBubblePlaying || isBubbleComplete}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Step
                  </button>
                  <button
                    type="button"
                    onClick={replayBubblePlayback}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-500 hover:text-cyan-200"
                  >
                    Replay
                  </button>
                </div>
              </div>
            )}

            {isBubbleSelected && (
              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
                  Code Language
                </p>
                <select
                  value={bubbleLanguage}
                  onChange={(event) => setBubbleLanguage(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition focus:border-cyan-500 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mt-8">
        {isBubbleSelected ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-6 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400/80">
                Step Insight
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-100">
                {bubbleStep?.message ?? 'Generate Bubble Sort steps to start playback.'}
              </h3>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Active Indices
                  </p>
                  <p className="mt-2 font-mono text-lg text-slate-100">
                    {activeBubbleIndices.length > 0
                      ? activeBubbleIndices.join(', ')
                      : 'None'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Sorted Count
                  </p>
                  <p className="mt-2 font-mono text-lg text-slate-100">
                    {sortedBubbleIndices.length}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Variables
                  </p>
                  <p className="mt-2 font-mono text-sm text-slate-100">
                    {bubbleStep?.variables
                      ? Object.entries(bubbleStep.variables)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join('  ')
                      : 'n/a'}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Synchronization
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Each playback step owns the array snapshot, active indices,
                  explanation text, and source line. The chart and code panel
                  both render from that same step object, so they stay aligned
                  by construction.
                </p>
              </div>
            </div>

            <CodePanel
              title="Bubble Sort"
              code={bubbleSource.code}
              language={bubbleLanguage}
              activeLine={activeBubbleLine}
            />
          </div>
        ) : (
          <CodeDisplay algorithm={selectedAlgorithm} />
        )}
      </div>

      <style>{`
        .array-ele.active { background: #10b981 !important; color: white; border-color: #059669; transform: scale(1.1); }
        .array-ele.compare { background: #2563eb !important; color: white; border-color: #3b82f6; transform: scale(1.12); box-shadow: 0 0 0 1px rgba(147, 197, 253, 0.55), 0 0 18px rgba(59, 130, 246, 0.35); }
        .array-ele.swap { background: #f59e0b !important; color: white; border-color: #d97706; transform: scale(1.1); }
        .array-ele.sorted { background: #0891b2 !important; color: white; border-color: #06b6d4; }
        .array-ele.pivot { background: #f43f5e !important; color: white; border-color: #e11d48; }
        .array-ele.min { background: #8b5cf6 !important; color: white; border-color: #7c3aed; }
        
        .bar.active { background: #10b981 !important; box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); border-color: #059669; }
        .bar.compare { background: #2563eb !important; box-shadow: 0 0 18px rgba(59, 130, 246, 0.55); border-color: #60a5fa; transform: translateY(-4px); }
        .bar.swap { background: #f59e0b !important; box-shadow: 0 0 15px rgba(245, 158, 11, 0.45); border-color: #d97706; }
        .bar.sorted { background: #0891b2 !important; box-shadow: 0 0 15px rgba(6, 182, 212, 0.45); border-color: #06b6d4; }
        .bar.pivot { background: #f43f5e !important; box-shadow: 0 0 15px rgba(244, 63, 94, 0.5); border-color: #e11d48; }
        .bar.min { background: #8b5cf6 !important; box-shadow: 0 0 15px rgba(139, 92, 246, 0.5); border-color: #7c3aed; }
        
        .bar-val { 
          display: flex; justify-content: center; 
          color: rgba(255,255,255,0.9); font-size: 10px; font-weight: bold; 
          padding-top: 4px;
        }
        .count-val {
          display: flex; justify-content: center;
          color: #e2e8f0; font-size: small; font-weight: bold;
          position: absolute; bottom: -24px; width: 100%;
        }
      `}</style>
    </div>
  )
}
