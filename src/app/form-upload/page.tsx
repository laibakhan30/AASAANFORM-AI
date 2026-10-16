'use client';

import { useState } from 'react';
// Using emoji instead of heroicon for upload button
import Link from 'next/link';
import { useAppContext } from '@/lib/app-context';

export default function FormUpload() {
  const { formData, setFormData, language } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Texts for this page
  const t = {
    en: {
      title: 'Upload Your Form',
      description:
        'Upload an image or PDF of the form you want to fill out. We support JPEG, PNG, WebP, and PDF files up to 10MB.',
      uploadHint: 'Click to upload or drag and drop',
      formats: 'Supported formats: JPEG, PNG, WebP, PDF (max 10MB)',
      removeButton: 'Remove form',
      continueButton: 'Continue to Understanding',
      errorUnsupportedType: 'Unsupported file type. Please upload JPEG, PNG, WebP, or PDF.',
      errorSizeTooLarge: 'File size too large. Please upload a file smaller than 10MB.',
    },
    hi: {
      title: 'अपना फ़ॉर्म अपलोड करें',
      description:
        'वह छवि या PDF अपलोड करें जिसे आप भरना चाहते हैं। हम JPEG, PNG, WebP, और PDF फ़ाइलों का समर्थन करते हैं, अधिकतम 10MB तक।',
      uploadHint: 'अपलोड करने के लिए क्लिक करें या 드래ग एंड ड्रॉप करें',
      formats: 'समर्थित प्रारूप: JPEG, PNG, WebP, PDF (अधिकतम 10MB)',
      removeButton: 'फ़ॉर्म हटाएं',
      continueButton: 'समझने के लिए आगे बढ़ें',
      errorUnsupportedType: 'असमर्थित फ़ाइल प्रकार। कृपया JPEG, PNG, WebP, या PDF अपलोड करें।',
      errorSizeTooLarge: 'फ़ाइल आकार बहुत बड़ा है। कृपया 10MB से छोटी फ़ाइल अपलोड करें।',
    },
    mr: {
      title: 'आपला फॉर्म अपलोड करा',
      description:
        'जे फॉर्म टू भरायचे असतो तिचा प्रतिमा किंवा PDF अपलोड करा. आम्ही JPEG, PNG, WebP, आणि PDF फाइल्स sample करतो, अधिकतम 10MB पर्यंत.',
      uploadHint: 'अपलोड करण्यासाठी क्लिक करा किंवा ड्रॅग आणि ड्रॉप करा',
      formats: 'समर्थित स्वरूप: JPEG, PNG, WebP, PDF (मaks 10MB)',
      removeButton: 'फॉर्म हटवा',
      continueButton: 'समजूनेसाठी पुढे जा',
      errorUnsupportedType: 'असमर्थित फाइल प्रकार. कृपया JPEG, PNG, WebP, किंवा PDF अपलोड करा.',
      errorSizeTooLarge: 'फाइल आकार खूप मोठा आहे. कृपया 10MB पासून छोटा फाइल अपलोड करा.',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  const handleFormUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError(lang.errorUnsupportedType);
      return;
    }

    // Validate file size (e.g., 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(lang.errorSizeTooLarge);
      return;
    }

    setIsUploading(true);
    setError(null);

    // Create a local URL for preview
    const fileUrl = URL.createObjectURL(file);

    // Update the context with the form URL
    setFormData(prev => ({
      ...prev,
      formUrl: fileUrl,
      formFields: null, // reset form fields when a new form is uploaded
    }));

    setIsUploading(false);
  };

  const handleRemoveForm = () => {
    setFormData(prev => {
      if (prev.formUrl) {
        URL.revokeObjectURL(prev.formUrl);
      }
      return {
        ...prev,
        formUrl: null,
        formFields: null,
      };
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
            <label htmlFor="form-upload" className="cursor-pointer">
              {!formData.formUrl ? (
                <>
                  <span className="mx-auto h-12 w-12 text-indigo-500 mb-4 flex-items-center justify-center">📤</span>
                  <p className="text-sm text-gray-600">{lang.uploadHint}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {lang.formats}
                  </p>
                </>
              ) : (
                <>
                  <img
                    src={formData.formUrl}
                    alt="Uploaded form preview"
                    className="max-w-full h-auto rounded-lg mb-4"
                  />
                  <button
                    onClick={handleRemoveForm}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    {lang.removeButton}
                  </button>
                </>
              )}
              <input
                id="form-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={handleFormUpload}
              />
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-200 text-red-700 p-4">
              <p>{error}</p>
            </div>
          )}

          {formData.formUrl && !isUploading && (
            <div className="flex justify-end">
              <Link
                href="/form-understanding"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                {lang.continueButton}
              </Link>
            </div>
          )}
        </div>
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