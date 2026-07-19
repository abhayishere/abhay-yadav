import Header from '../components/Header'

export default function Projects() {
  const projects = [
    {
      title: "AI Blog Pipeline",
      description: "Planner → Writer → Editor multi-agent pipeline using LangGraph for stateful workflow orchestration, automated via GitHub Actions cron with Telegram notifications. Powers this site's blog.",
      tech: ["Python", "LangGraph", "Gemini 2.0 Flash", "GitHub Actions"],
      link: "https://abhay-yadav.vercel.app/blog"
    },
    {
      title: "Recallr",
      description: "Production-style RAG system in Go with clean separation of concerns across ingestion, embedding, and retrieval layers; Ollama + Gemma with pgvector (IVFFLAT/cosine) for semantic search over personal notes. Exposes JSON HTTP APIs and a Cobra CLI with REPL.",
      tech: ["Go", "Postgres (pgvector)", "Ollama", "Gemma"],
      link: "https://github.com/abhayishere/Recallr"
    },
    {
      title: "DBXp",
      description: "Modular, extensible terminal database explorer in Go supporting PostgreSQL, MySQL, and SQLite, with real-time schema exploration, live SQL preview, query history, CSV export, and safety validation against destructive operations.",
      tech: ["Go", "Postgres", "MySQL", "SQLite"],
      link: "https://github.com/abhayishere/DBXp"
    },
    {
      title: "SecondBrain",
      description: "Chrome extension with Firebase Authentication, Go-based RESTful API with Firestore, and a React web app.",
      tech: ["React", "Go", "Firebase", "RESTful API"],
      link: "https://secondbrainweb.vercel.app/"
    },
    {
      title: "Tiny DCS",
      description: "Distributed cache system in Golang using consistent hashing, a custom hash ring, and a central coordinator.",
      tech: ["Go", "Distributed Systems", "Caching"],
      link: "https://github.com/abhayishere/tiny-dcs"
    },
    {
      title: "Online Judge",
      description: "Online Judge website, similar to Codeforces and LeetCode.",
      tech: ["React", "Node.js", "Docker"],
      link: "https://github.com/abhayishere/Ojay"
    }
  ];

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="mb-12">
        
        <div className="grid gap-6">
          {projects.map((project, index) => (
            <a 
              key={index} 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer" 
              className="block p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-300 hover:bg-gray-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-mono text-white">{project.title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
