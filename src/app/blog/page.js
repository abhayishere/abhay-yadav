import Header from '../components/Header'

export default function Blog() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="mb-12">
        <h2 className="text-2xl font-mono text-gray-400 mb-8">Blogs</h2>
        
        <div className="space-y-8 text-gray-400 font-mono">
          {/* Blog posts will go here */}
          <p>Coming soon...</p>
        </div>
      </div>
    </main>
  )
} 