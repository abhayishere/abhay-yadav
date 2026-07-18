'use client'

import { useState } from 'react'

export default function ReviewActions({ slug, token }) {
  const [status, setStatus] = useState('idle') // idle | working | done | error
  const [message, setMessage] = useState('')

  async function act(action) {
    setStatus('working')
    try {
      const res = await fetch('/api/blog/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, token, action }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('done')
      setMessage(
        action === 'keep'
          ? 'Kept! It will go live for everyone once the site redeploys (~1 min).'
          : 'Removed! It will disappear once the site redeploys (~1 min).'
      )
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong. Check the GitHub Action / API logs.')
    }
  }

  if (status === 'done') {
    return <p className="text-green-500 font-mono text-sm">{message}</p>
  }

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={() => act('keep')}
          disabled={status === 'working'}
          className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 disabled:opacity-50 font-mono text-sm"
        >
          Keep
        </button>
        <button
          onClick={() => act('remove')}
          disabled={status === 'working'}
          className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 disabled:opacity-50 font-mono text-sm"
        >
          Remove
        </button>
      </div>
      {status === 'error' && <p className="text-red-500 font-mono text-sm mt-2">{message}</p>}
    </div>
  )
}
