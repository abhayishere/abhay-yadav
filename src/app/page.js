import Header from './components/Header'
import Link from 'next/link'


export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="space-y-8 font-mono">
        <p className="text-lg">
          Hi! I'm Abhay Yadav, and I like to build software and solve problems.
        </p>

        <p className="text-lg">
          I'm a software engineer passionate about web development, and a cp lover. 

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