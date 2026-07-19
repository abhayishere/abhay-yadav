import Header from '../components/Header'

export default function Experience() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="mb-12">
        
        <div className="space-y-12">
          <div className="border-l-2 border-gray-700 pl-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-mono">Software Engineer II, Fund Transfer Team</h3>
              <span className="text-gray-500 text-sm ml-auto">June 2023 - Present</span>
            </div>
            <p className="text-gray-400 font-mono mb-4">HDFC Bank, Bangalore</p>
            <ul className="list-disc list-inside text-gray-400 space-y-3 text-sm">
              <li>Designed and owned 15+ MCP servers/tools for an LLM-powered payments platform, applying domain-driven design and platform-level API patterns for natural-language payment commands; mentored 4 junior developers</li>
              <li>Implemented Beneficiary Transfer Limit and a caching strategy for available transfer limits using Aerospike, reducing API response time by 30% during peak transaction hours; improved unit test coverage to &gt;95%</li>
              <li>Built a RAG-based internal knowledge assistant integrated with Confluence APIs using Python + pgvector, evaluating embedding models (nomic-embed-text vs bge-m3) to optimize retrieval quality</li>
              <li>Developed an internal cloud-native observability system tracking 30+ OBP APIs, 25+ Common Service APIs, and 400+ AppGen parameters on Kubernetes; integrated Checkmarx/SonarQube into CI/CD, resolving 150+ security issues</li>
            </ul>
          </div>

          <div className="border-l-2 border-gray-700 pl-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-mono">Software Engineer I, Fund Transfer Team</h3>
              <span className="text-gray-500 text-sm ml-auto">June 2023 - August 2024</span>
            </div>
            <p className="text-gray-400 font-mono mb-4">HDFC Bank, Bangalore</p>
            <ul className="list-disc list-inside text-gray-400 space-y-3 text-sm">
              <li>Contributed to the backend of the Early Access Mobile App, supporting its growth to 500K+ installs, a Top 10 Finance App Store ranking, and 99.87% of all May transactions processed through the app</li>
              <li>Architected and delivered cloud-native, event-driven Golang microservices (NEFT, IMPS, RTGS, UPI, Foreign Remittance) on Kubernetes via Helm charts, using goroutines/channels/mutexes for high-throughput processing</li>
              <li>Integrated pub/sub async messaging and Aerospike caching, reducing backend load by 45%</li>
              <li>Managed 2 CUG releases end-to-end via CI/CD pipelines (Jenkins, GitHub Actions); served on-call rotation for production payment services</li>
            </ul>
          </div>

          <div className="border-l-2 border-gray-700 pl-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-mono">Data Scientist</h3>
              <span className="text-gray-500 text-sm ml-auto">Jan 2022 - April 2022</span>
            </div>
            <p className="text-gray-400 font-mono mb-4">Indian Sign Language, IIT Jammu</p>
            <ul className="list-disc list-inside text-gray-400 space-y-3 text-sm">
              <li>Implemented transfer learning with VGG16 Model for Indian Sign Language recognition</li>
              <li>Processed 6000+ images across 83 different sign language words for model training</li>
              <li>Created web and Android applications for universal model accessibility</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
