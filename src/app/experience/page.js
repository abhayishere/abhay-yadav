import Header from '../components/Header'

export default function Experience() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-white">
      <Header />
      <div className="mb-12">
        
        <div className="space-y-12">
          <div className="border-l-2 border-gray-700 pl-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center mb-3">
              <h3 className="text-xl font-mono">Backend Developer, Fund Transfer Team</h3>
              <span className="text-gray-500 text-sm ml-auto">June 2023 - Present</span>
            </div>
            <p className="text-gray-400 font-mono mb-4">HDFC Bank, Bangalore</p>
            <ul className="list-disc list-inside text-gray-400 space-y-3 text-sm">
              <li>Designed and implemented fund transfer solutions (NEFT, IMPS, RTGS) using Golang for mobile banking app</li>
              <li>Developed verifypayee API integration with NPCI for beneficiary verification system</li>
              <li>Achieved 97% test coverage for fund transfer methods using comprehensive Golang test suite</li>
              <li>Reduced issue diagnosis time by 75% through GCP BigQuery log analysis implementation</li>
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
