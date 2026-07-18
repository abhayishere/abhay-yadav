import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Header from '../../components/Header'
import blogs from '../../../../content/blogs.json'
import { isValidReviewToken } from '@/lib/reviewToken'
import ReviewActions from '../ReviewActions'
import SelectionFeedback from '../SelectionFeedback'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return blogs.filter((post) => post.status === 'published').map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = blogs.find((p) => p.slug === slug && p.status === 'published')
  if (!post) return {}
  return { title: `${post.title} — Abhay Yadav`, description: post.description }
}

export default async function BlogPost({ params, searchParams }) {
  const { slug } = await params
  const { review: reviewToken } = await searchParams

  const post = blogs.find(
    (p) =>
      p.slug === slug &&
      (p.status === 'published' || (p.status === 'pending' && isValidReviewToken(slug, reviewToken)))
  )
  if (!post) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <article>
        {post.status === 'pending' && (
          <p className="text-yellow-500 font-mono text-sm mb-3">🔒 Pending review — only visible to you</p>
        )}
        <h1 className="text-3xl font-mono mb-2">{post.title}</h1>
        <p className="text-gray-500 font-mono text-sm mb-8">{post.date}</p>

        {post.status === 'pending' ? (
          <SelectionFeedback slug={post.slug} token={reviewToken}>
            <div className="prose prose-invert prose-headings:font-mono font-mono max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </SelectionFeedback>
        ) : (
          <div className="prose prose-invert prose-headings:font-mono font-mono max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        )}

        {post.status === 'pending' && (
          <div className="mt-8 border-t border-gray-800 pt-6">
            <ReviewActions slug={post.slug} token={reviewToken} />
          </div>
        )}
      </article>
    </main>
  )
}
