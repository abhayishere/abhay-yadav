import Link from 'next/link'
import Header from '../components/Header'
import blogs from '../../../content/blogs.json'
import { isValidReviewToken } from '@/lib/reviewToken'
import ReviewActions from './ReviewActions'

export const dynamic = 'force-dynamic'

export default async function Blog({ searchParams }) {
  const params = await searchParams
  const reviewToken = params?.review

  const published = blogs
    .filter((post) => post.status === 'published')
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  const pending = reviewToken
    ? blogs.find((post) => post.status === 'pending' && isValidReviewToken(post.slug, reviewToken))
    : null

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="mb-12">
        <h2 className="text-2xl font-mono text-gray-400 mb-8">Blogs</h2>

        {pending && (
          <div className="mb-10 border border-yellow-600/50 rounded-lg p-5 bg-yellow-900/10">
            <p className="text-yellow-500 font-mono text-sm mb-3">
              🔒 Pending review — only visible to you
            </p>
            <Link href={`/blog/${pending.slug}?review=${reviewToken}`} className="block group">
              <h3 className="text-xl font-mono text-white group-hover:underline mb-1">{pending.title}</h3>
              <p className="text-gray-400 font-mono text-sm mb-4">{pending.description}</p>
            </Link>
            <ReviewActions slug={pending.slug} token={reviewToken} />
          </div>
        )}

        <div className="space-y-8 text-gray-400 font-mono">
          {published.length === 0 && !pending && <p>Coming soon...</p>}
          {published.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <h3 className="text-lg text-white group-hover:underline">{post.title}</h3>
              <p className="text-sm text-gray-500">{post.date}</p>
              <p className="text-sm">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
