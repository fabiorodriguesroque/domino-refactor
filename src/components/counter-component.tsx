'use client'
import { useStore } from '../store/store'
import { useScore } from '../hooks/useScore'
import { useEffect } from 'react'

export default function Counter() {
  const { count, inc } = useStore()
  const { validateScore } = useScore()

  useEffect(() => {
    validateScore(count)
  }, [count, validateScore])

  return (
    <div className="mt-10 flex flex-col items-center gap-2">
      <span className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-slate-300 bg-slate-200 text-4xl font-semibold text-slate-950 select-none">
        {count}
      </span>
      <button
        onClick={inc}
        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-base font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
      >
        one up
      </button>
    </div>
  )
}
