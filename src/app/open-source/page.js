import Header from '../components/Header'

export default function OpenSource() {
  const contributions = [
    {
      title: "fix(go): implement Anthropic streaming (ChatStreamlyWithSender)",
      repo: "infiniflow/ragflow",
      description: "The Go Anthropic driver's ChatStreamlyWithSender was a stub that always returned \"no such method\", so any caller requesting a streamed response from a Claude model via the Go path failed outright. Implemented it by opening the Messages API with stream=true and parsing the SSE response via the shared ParseSSEStream helper, forwarding text_delta/thinking_delta content through the sender callback.",
      tech: ["Go", "Anthropic API", "SSE"],
      status: "Merged",
      date: "Jul 2026",
      link: "https://github.com/infiniflow/ragflow/pull/17380"
    }
  ];

  const statusStyles = {
    Merged: "bg-purple-900/40 text-purple-300",
    Open: "bg-green-900/40 text-green-300",
    Closed: "bg-red-900/40 text-red-300"
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="mb-12">
        <div className="grid gap-6">
          {contributions.map((contribution, index) => (
            <a
              key={index}
              href={contribution.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 border border-gray-700 rounded-lg hover:border-blue-500 transition-all duration-300 hover:bg-gray-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-mono text-white">{contribution.title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <div className="flex items-center gap-3 mb-4 text-sm font-mono text-gray-500">
                <span>{contribution.repo}</span>
                <span>·</span>
                <span>{contribution.date}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${statusStyles[contribution.status]}`}>
                  {contribution.status}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{contribution.description}</p>
              <div className="flex flex-wrap gap-2">
                {contribution.tech.map((tech, techIndex) => (
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
