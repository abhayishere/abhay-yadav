import { NextResponse } from 'next/server'
import { isValidReviewToken } from '@/lib/reviewToken'

const GITHUB_API = 'https://api.github.com'

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
  return res.json()
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { slug, token, action } = body || {}
  if (!slug || !token || !['keep', 'remove'].includes(action)) {
    return NextResponse.json({ error: 'slug, token and a valid action are required' }, { status: 400 })
  }

  if (!isValidReviewToken(slug, token)) {
    return NextResponse.json({ error: 'Invalid or expired review token' }, { status: 401 })
  }

  const repo = getRepo()
  const branch = process.env.GITHUB_BRANCH || 'main'
  const filePath = 'content/blogs.json'

  const file = await githubRequest(`/repos/${repo}/contents/${filePath}?ref=${branch}`)
  const currentJson = Buffer.from(file.content, 'base64').toString('utf-8')
  const posts = JSON.parse(currentJson)

  const index = posts.findIndex((p) => p.slug === slug && p.status === 'pending')
  if (index === -1) {
    return NextResponse.json({ error: 'No pending post found for this slug' }, { status: 404 })
  }

  if (action === 'keep') {
    posts[index] = { ...posts[index], status: 'published' }
  } else {
    posts.splice(index, 1)
  }

  const updatedContent = Buffer.from(JSON.stringify(posts, null, 2) + '\n', 'utf-8').toString('base64')

  await githubRequest(`/repos/${repo}/contents/${filePath}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `chore: ${action} blog post "${slug}"`,
      content: updatedContent,
      sha: file.sha,
      branch,
    }),
  })

  return NextResponse.json({ ok: true, action })
}
