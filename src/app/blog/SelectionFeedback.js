'use client'

import { useRef, useState } from 'react'

export default function SelectionFeedback({ slug, token, children }) {
  const wrapperRef = useRef(null)
  const contentRef = useRef(null)
  const [popover, setPopover] = useState(null) // { x, y, quote }
  const [draftComment, setDraftComment] = useState('')
  const [notes, setNotes] = useState([]) // [{ id, quote, comment }]
  const [status, setStatus] = useState('idle') // idle | working | done | error
  const [message, setMessage] = useState('')

  function handleMouseUp() {
    const selection = window.getSelection()
    const quote = selection?.toString().trim()
    if (!quote || !contentRef.current?.contains(selection.anchorNode)) {
      return
    }
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    setDraftComment('')
    setPopover({
      x: rect.left + rect.width / 2 - wrapperRect.left,
      y: rect.top - wrapperRect.top,
      quote: quote.slice(0, 500),
    })
  }

  function addNote() {
    if (!draftComment.trim()) return
    setNotes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), quote: popover.quote, comment: draftComment.trim() },
    ])
    setPopover(null)
    window.getSelection()?.removeAllRanges()
  }

  function removeNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  async function submitFeedback() {
    setStatus('working')
    try {
      const res = await fetch('/api/blog/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          token,
          feedback: notes.map(({ quote, comment }) => ({ quote, comment })),
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      setStatus('done')
      setNotes([])
      setMessage(
        'Revision queued! The pipeline is rewriting the post now - check back in a few minutes and reload this page.'
      )
    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong sending feedback. Check the GitHub Action / API logs.')
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <p className="text-gray-500 font-mono text-xs mb-4">
        Select any text below to leave feedback on it.
      </p>

      <div ref={contentRef} onMouseUp={handleMouseUp}>
        {children}
      </div>

      {popover && (
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full bg-gray-900 border border-gray-700 rounded-lg p-3 w-72 shadow-xl"
          style={{ left: popover.x, top: popover.y - 8 }}
        >
          <p className="text-gray-400 font-mono text-xs mb-2 line-clamp-2">"{popover.quote}"</p>
          <textarea
            autoFocus
            value={draftComment}
            onChange={(e) => setDraftComment(e.target.value)}
            placeholder="What should change here?"
            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-sm font-mono text-white mb-2"
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setPopover(null)}
              className="px-3 py-1 rounded text-xs font-mono text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={addNote}
              disabled={!draftComment.trim()}
              className="px-3 py-1 rounded text-xs font-mono bg-blue-700 hover:bg-blue-600 disabled:opacity-50"
            >
              Add note
            </button>
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="mt-8 border-t border-gray-800 pt-6">
          <h4 className="font-mono text-sm text-gray-400 mb-3">
            Feedback notes ({notes.length})
          </h4>
          <ul className="space-y-3 mb-4">
            {notes.map((note) => (
              <li key={note.id} className="border border-gray-800 rounded-lg p-3 text-sm font-mono">
                <p className="text-gray-500 text-xs mb-1 line-clamp-2">"{note.quote}"</p>
                <p className="text-white flex-1">{note.comment}</p>
                <button
                  onClick={() => removeNote(note.id)}
                  className="text-red-500 hover:text-red-400 text-xs mt-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={submitFeedback}
            disabled={status === 'working'}
            className="px-4 py-2 rounded bg-blue-700 hover:bg-blue-600 disabled:opacity-50 font-mono text-sm"
          >
            {status === 'working' ? 'Sending...' : 'Update blog based on feedback'}
          </button>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 font-mono text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
