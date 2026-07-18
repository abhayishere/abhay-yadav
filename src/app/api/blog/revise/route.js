import { NextResponse } from 'next/server'
import { isValidReviewToken } from '@/lib/reviewToken'

const GITHUB_API = 'https://api.github.com'
const WORKFLOW_FILE = 'revise-blog.yml'

function getRepo() {
  const repo = process.env.GITHUB_REPO // e.g. "abhayishere/abhay-yadav"
  if (!repo) throw new Error('GITHUB_REPO is not set')
  return repo
}

async function githubRequest(path, options = {}) {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is not set')
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${path} failed: ${res.status} ${body}`)
  }
  return res.status === 204 ? null : res.json()
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { slug, token, feedback } = body || {}
  if (!slug || !token || !Array.isArray(feedback) || feedback.length === 0) {
    return NextResponse.json(
      { error: 'slug, token and a non-empty feedback array are required' },
      { status: 400 }
    )
  }

  if (!isValidReviewToken(slug, token)) {
    return NextResponse.json({ error: 'Invalid or expired review token' }, { status: 401 })
  }

  const cleanedFeedback = feedback
    .map((item) => ({
      quote: String(item?.quote || '').slice(0, 2000),
      comment: String(item?.comment || '').slice(0, 2000),
    }))
    .filter((item) => item.comment)

  if (cleanedFeedback.length === 0) {
    return NextResponse.json({ error: 'No usable feedback comments provided' }, { status: 400 })
  }

  const repo = getRepo()
  const branch = process.env.GITHUB_BRANCH || 'main'

  await githubRequest(`/repos/${repo}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({
      ref: branch,
      inputs: {
        slug,
        feedback: JSON.stringify(cleanedFeedback),
      },
    }),
  })

  return NextResponse.json({ ok: true, queued: true })
}
