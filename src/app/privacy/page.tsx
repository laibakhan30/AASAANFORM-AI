import Link from 'next/link';

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-6">
          At PatraPilot AI, we take your privacy seriously. This page explains
          how we handle your information when you use our application.
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-700">
              When you use PatraPilot AI, we may temporarily process the following
              information:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              <li>
                Form images or PDFs that you upload
              </li>
              <li>
                Supporting document images or PDFs that you upload
              </li>
              <li>
                Text extracted from these documents by our AI service
              </li>
              <li>
                The values you enter or confirm in the form fields
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700">
              We use your information solely to:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
              <li>
                Extract relevant data from your documents using AI
              </li>
              <li>
                Help you understand form fields and fill out the form accurately
              </li>
              <li>
                Generate a printable draft of the completed form
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Data Storage and Retention
            </h2>
            <p className="text-gray-700">
              We do not permanently store your personal data. All uploaded files
              and extracted information are temporarily stored in your browser's
              memory and are deleted when you close the browser tab or clear the
              application data.
            </p>
            <p className="text-gray-700 mt-2">
              We do not send your data to any external servers for storage.
              Any AI processing is done in real-time and the results are not
              retained after your session ends.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sharing and Disclosure
            </h2>
            <p className="text-gray-700">
              We do not share your personal information with any third parties.
              Your data remains private to your session.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Choices
            </h2>
            <p className="text-gray-700">
              You can remove uploaded files at any time using the remove buttons
              in the application. Clearing your browser data will also remove
              all temporary information.
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