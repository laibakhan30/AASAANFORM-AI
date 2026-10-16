'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/app-context';
import Link from 'next/link';
import { Upload } from '@heroicons/react/24/solid';

// Dummy component for ArrowLeft
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9L9 15.75m0 0L2.25 9m13.5 0h-13.5a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75v9a2.25 2.25 0 01-2.25 2.25z" />
  </svg>
);

// Mock AI response for extracting values from a supporting document
type MockExtractedValue = {
  fieldId: string;
  value: string;
  confidence: number;
};

// In a real app, we would call an API route to process the document
async function processDocument(file: File): Promise<MockExtractedValue[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock data based on the file name or type? For now, we'll return a fixed set of values
  // that correspond to the form fields we mocked earlier.
  // We'll return different values based on a seed to simulate different documents.
  const seed = file.name.hashCode(); // We'll implement a simple hashCode

  // Mock data for a fictional identity document
  return [
    {
      fieldId: 'field1', // Full Name
      value: 'Kiran Demo',
      confidence: 0.95,
    },
    {
      fieldId: 'field2', // Date of Birth
      value: '15/08/1990',
      confidence: 0.9,
    },
    {
      fieldId: 'field3', // Father's Name
      value: 'Mohan Demo',
      confidence: 0.92,
    },
    {
      fieldId: 'field4', // Mother's Name
      value: 'Sita Demo',
      confidence: 0.93,
    },
    {
      fieldId: 'field5', // Address
      value: '123, Main Street, Anytown',
      confidence: 0.88,
    },
    {
      fieldId: 'field6', // PIN Code
      value: '110001',
      confidence: 0.97,
    },
  ];
}

// Helper function to hash a string (simple implementation)
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
};

export default function SupportingDocuments() {
  const { supportingDocuments, setSupportingDocuments, formData, setFormData, language } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // Texts for this page
  const t = {
    en: {
      title: 'Upload Supporting Documents',
      description:
        'Upload images or PDFs of your supporting documents (e.g., identity proof, birth certificate). We will extract information from these documents to help you fill out the form.',
      uploadHint: 'Click to upload or drag and drop',
      formats: 'Supported formats: JPEG, PNG, WebP, PDF (max 10MB)',
      uploading: 'Uploading...',
      documentsTitle: 'Uploaded Documents',
      extractedInfo: 'Extracted Information:',
      failedToProcess: 'Failed to process this document. Please try uploading again.',
      continueButton: 'Continue to Extraction & Mapping',
    },
    hi: {
      title: 'सहायक दस्तावेज़ अपलोड करें',
      description:
        'अपने सहायक दस्तावेज़ों (जैसे पहचान प्रमाण, जन्म प्रमाणपत्र) की चित्र या PDF अपलोड करें। हम इन दस्तावेज़ों से जानकारी निकालेंगे ताकि आपको फ़ॉर्म भरने में मदद मिल सके।',
      uploadHint: 'अपलोड करने के लिए क्लिक करें या 드래그 एンド 드롭 करें',
      formats: 'समर्थित प्रारूप: JPEG, PNG, WebP, PDF (अधिकतम 10MB)',
      uploading: 'अपलोड हो रहा है...',
      documentsTitle: 'अपलोड किए गए दस्तावेज़',
      extractedInfo: 'निकाली गई जानकारी:',
      failedToProcess: 'इस दस्तावेज़ को प्रोसेस करने में विफल रहा। कृपया फिर से अपलोड करने का प्रयास करें।',
      continueButton: 'निष्कर्षण एवं मानचित्रण के लिए आगे बढ़ें',
    },
    mr: {
      title: 'सहायक दस्तऐवज अपलोड करा',
      description:
        'तुमच्या सहायक दस्तऐवजांचे (जरे पहचान प्रमाणपत्र, जन्म प्रमाणपत्र) प्रतिमा किंवा PDF अपलोड करा. आम्ही त्से दस्तऐवजांमधील माहिती काढार Відеो तुम्हाला फॉर्म भरत/helper व्हावो.',
      uploadHint: 'अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग आणि ड्रॉप करा',
      formats: 'समर्थित स्वरूप: JPEG, PNG, WebP, PDF (मaks 10MB)',
      uploading: 'अपलोड होत आहे...',
      documentsTitle: 'अपलोड केले दस्तऐवज',
      extractedInfo: 'से extracted माहिती:',
      failedToProcess: 'हे दस्तऐवज प्रोसेस करणे असफल होता. कृपया पुन्हा अपलोड करा.',
      continueButton: 'निष्कर्षण व मानचित्रण artefacter पुढे जा',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(`${lang.uploadHint.replace('Click to upload or drag and drop', '')} ${file.name}: ${lang.errorUnsupportedType ?? 'Unsupported file type'}`);
        return;
      }
      if (file.size > maxSize) {
        setError(`${lang.uploadHint.replace('Click to upload or drag and drop', '')} ${file.name}: ${lang.errorSizeTooLarge ?? 'File size too large'}`);
        return;
      }
    }

    setIsUploading(true);
    setError(null);

    // Process each file
    const newDocuments: SupportingDocument[] = [];
    for (const file of files) {
      const fileId = Math.random().toString(36).substr(2, 9);
      const fileUrl = URL.createObjectURL(file);

      // Initialize document status
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // Process the document with AI (mock)
        const extractedValues = await processDocument(file);

        // Convert mock extracted values to our format
        const convertedExtractedValues: ExtractedValue[] = extractedValues.map((val) => ({
          fieldId: val.fieldId,
          value: val.value,
          confidence: val.confidence,
          sourceText: val.value, // In a real app, this would be the actual text from the document
          // sourceRegion would be available if we had coordinates
        }));

        newDocuments.push({
          id: fileId,
          name: file.name,
          url: fileUrl,
          status: 'processed',
          extractedValues: convertedExtractedValues,
        });

        // Update progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      } catch (err) {
        console.error('Error processing document:', err);
        // Even if processing fails, we still keep the document for preview
        newDocuments.push({
          id: fileId,
          name: file.name,
          url: fileUrl,
          status: 'error',
          extractedValues: [],
        });
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      }
    }

    // Update the context with the new documents
    setSupportingDocuments(prev => [...prev, ...newDocuments]);

    // Also, we can update the form data with the extracted values (for now, we'll just store them)
    // In a real app, we would map the extracted values to the form fields and update the status.
    // For simplicity, we'll just note that we have extracted values.
    setIsUploading(false);
  };

  const removeDocument = (id: string) => {
    setSupportingDocuments(prev => {
      const docToRemove = prev.find(doc => doc.id === id);
      if (docToRemove?.url) {
        URL.revokeObjectURL(docToRemove.url);
      }
      return prev.filter(doc => doc.id !== id);
    });
  };

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
          {lang.title}
        </h1>
        <p className="text-gray-600 mb-6">
          {lang.description}
        </p>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <label htmlFor="document-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-indigo-500 mb-4" />
              <p className="text-sm text-gray-600">{lang.uploadHint}</p>
              <p className="text-xs text-gray-400 mt-1">
                {lang.formats}
              </p>
              <input
                id="document-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                multiple
                className="hidden"
                onChange={handleDocumentUpload}
              />
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-200 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {lang.uploading}
              </h3>
              <div className="space-y-2">
                {Object.keys(uploadProgress).map((id) => {
                  const doc = supportingDocuments.find(d => d.id === id);
                  if (!doc) return null;
                  const progress = uploadProgress[id] ?? 0;
                  return (
                    <div key={id} className="flex items-center space-x-3">
                      <div className="w-16">{doc.name}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`bg-indigo-600 h-2.5 rounded-full transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-right">{progress}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {supportingDocuments.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {lang.documentsTitle}
              </h2>
              <div className="space-y-4">
                {supportingDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {doc.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.status === 'processed'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-600'
                      `}>
                        {doc.status === 'processed' && 'Processed'}
                        {doc.status === 'error' && 'Error'}
                      </span>
                    </div>
                    {doc.status === 'processed' && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          {lang.extractedInfo}
                        </p>
                        {doc.extractedValues.map((val) => (
                          const key = doc.id + '-' + val.fieldId;
                          return (
                            <div key={doc.id + '-' + val.fieldId} className="flex items-start space-x-3 text-sm text-gray-600">
                            <div className="flex-shrink-0 mt-0.5">•</div>
                            <div>
                              <span className="font-medium">{val.fieldId}:</span> {val.value}
                            </div>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    {doc.status === 'error' && (
                      <p className="text-sm text-red-600">
                        {lang.failedToProcess}
                      </p>
                    )}
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Link
                  href="/extraction-mapping"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                  {lang.continueButton}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}