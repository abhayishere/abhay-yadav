import Header from './components/Header'
import Link from 'next/link'


export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="space-y-8 font-mono">
        <p className="text-lg">
          Hi! I'm Abhay Yadav, a Software Engineer II at HDFC Bank building on the Fund Transfer team.
        </p>

        <p className="text-lg">
          I work on LLM-powered payments infrastructure — designing MCP servers, RAG systems, and
          event-driven Golang microservices that move money for millions of users. Outside of that,
          I like building side projects in Go and Python (RAG systems, TUIs, agentic pipelines) and
          I'm a competitive programming lover.

          Outside of coding, I enjoy badminton, chess, swimming, listening to music, playing ps5 and travelling.
        </p>

        <div className="mt-12">
        <h3 className="text-2xl text-gray-400 mb-4">
            Here's my most recent posts or <Link href="/blog" className="underline hover:text-gray-300">read a random one!</Link>
          </h3>
        </div>
      </div>
    </main>
  )
}