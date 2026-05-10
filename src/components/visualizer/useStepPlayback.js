import { startTransition, useEffect, useRef, useState } from 'react'

const MIN_DELAY = 120

export function useStepPlayback({ speed = 1 }) {
  const [steps, setSteps] = useState([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const timeoutRef = useRef(null)

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null

  const hasSteps = steps.length > 0
  const isComplete = hasSteps && currentStepIndex === steps.length - 1

  useEffect(() => {
    if (!isPlaying || !hasSteps || currentStepIndex < 0) {
      return undefined
    }

    if (currentStepIndex >= steps.length - 1) {
      return undefined
    }

    const delay = Math.max(
      MIN_DELAY,
      Math.round((currentStep?.duration ?? 700) / Math.max(speed, 0.1))
    )

    timeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setCurrentStepIndex((index) => {
          const nextIndex =
            index < steps.length - 1 ? index + 1 : steps.length - 1

          if (nextIndex >= steps.length - 1) {
            setIsPlaying(false)
          }

          return nextIndex
        })
      })
    }, delay)

    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [currentStep, currentStepIndex, hasSteps, isPlaying, speed, steps.length])

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current)
    },
    []
  )

  const loadSteps = (nextSteps, options = {}) => {
    const { autoPlay = true } = options

    window.clearTimeout(timeoutRef.current)
    setSteps(nextSteps)
    setCurrentStepIndex(nextSteps.length > 0 ? 0 : -1)
    setIsPlaying(autoPlay && nextSteps.length > 1)
  }

  const clear = () => {
    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setSteps([])
    setCurrentStepIndex(-1)
  }

  const pause = () => {
    setIsPlaying(false)
  }

  const play = () => {
    if (!hasSteps || currentStepIndex >= steps.length - 1) {
      return
    }

    setIsPlaying(true)
  }

  const reset = () => {
    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setCurrentStepIndex(hasSteps ? 0 : -1)
  }

  const replay = () => {
    if (!hasSteps) {
      return
    }

    window.clearTimeout(timeoutRef.current)
    setCurrentStepIndex(0)
    setIsPlaying(steps.length > 1)
  }

  const stepForward = () => {
    if (!hasSteps) {
      return
    }

    window.clearTimeout(timeoutRef.current)
    setIsPlaying(false)
    setCurrentStepIndex((index) => {
      if (index < 0) {
        return 0
      }

      return Math.min(index + 1, steps.length - 1)
    })
  }

  return {
    steps,
    currentStep,
    currentStepIndex,
    hasSteps,
    isComplete,
    isPlaying,
    loadSteps,
    clear,
    pause,
    play,
    reset,
    replay,
    stepForward,
  }
}
