import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 text-indigo-600 font-medium">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          About PatraPilot AI
        </h1>
        <p className="text-gray-600 mb-6">
          PatraPilot AI is a hackathon project created for Poona College CodeCraft 2026.
          Our mission is to help people understand and fill out unfamiliar forms with
          confidence.
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-700">
              To empower individuals who struggle with formal documents by providing
              an accessible, AI-powered tool that explains form fields in simple
              language and guides them through the completion process.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How It Works
            </h2>
            <ol className="list-decimal list-inside mt-4 space-y-2 text-gray-700">
              <li>
                Upload a form image or PDF
              </li>
              <li>
                The AI identifies and explains each field in simple language
              </li>
              <li>
                Upload supporting documents (e.g., identity proof, birth certificate)
              </li>
              <li>
                The AI extracts relevant information from your documents
              </li>
              <li>
                Review, confirm, or correct the extracted values for each field
              </li>
              <li>
                Generate a printable draft of the completed form
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-sm text-gray-600">
              Built with Next.js, React, TypeScript, and Tailwind CSS.
              AI-powered by Gemma 4 for natural language understanding.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Team
            </h2>
            <p className="text-gray-700">
              This project was created by a team of students participating in
              Poona College CodeCraft 2026.
            </p>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © 2026 PatraPilot AI. A hackathon project for Poona College CodeCraft 2026.
          </p>
        </footer>
      </div>
    </div>
  );
}

// Dummy component for ArrowLeft
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9L9 15.75m0 0L2.25 9m13.5 0h-13.5a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75v9a2.25 2.25 0 01-2.25 2.25z" />
  </svg>
);