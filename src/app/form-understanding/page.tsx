'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/lib/app-context';
import Link from 'next/link';
import Image from 'next/image';

// Dummy component for ArrowLeft
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9L9 15.75m0 0L2.25 9m13.5 0h-13.5a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75v9a2.25 2.25 0 01-2.25 2.25z" />
  </svg>
);

// Mock AI response for now
type MockFormField = {
  id: string;
  label: string;
  description: string;
};

// In a real app, we would call an API route to process the form
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
async function processForm(formUrl: string): Promise<MockFormField[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock data based on the form type? For now, we'll return a fixed set of fields
  // for a fictional SIR-style form in Hindi.
  // We'll return the labels and descriptions in Hindi for the demo.
  // Note: In a real implementation, we would use the formUrl to fetch and process the actual form
  // We're intentionally not using formUrl in this mock implementation
  return [
    {
      id: 'field1',
      label: 'पूरा नाम (Full Name)',
      description: 'अपना पूरा नाम लिखें जैसे कि आपके पहचान दस्तावेज में है।',
    },
    {
      id: 'field2',
      label: 'जन्म तिथि (Date of Birth)',
      description: 'DD/MM/MMYY प्रारूप में अपनी जन्म तिथि लिखें।',
    },
    {
      id: 'field3',
      label: 'पिता का नाम (Father\'s Name)',
      description: 'अपके पिता का पूरा नाम लिखें।',
    },
    {
      id: 'field4',
      label: 'माता का नाम (Mother\'s Name)',
      description: 'अपकी माता का पूरा नाम लिखें।',
    },
    {
      id: 'field5',
      label: 'पता (Address)',
      description: 'अपका वर्तमान पता लिखें।',
    },
    {
      id: 'field6',
      label: 'पिन कोड (PIN Code)',
      description: 'अपके क्षेत्र का 6 अंकों का पिन कोड लिखें।',
    },
  ];
}

export default function FormUnderstanding() {
  const { formData, setFormData, language } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Texts for this page
  const t = {
    en: {
      title: 'Form Understanding',
      description:
        'The AI has analyzed your form and identified the fields below. Each field is explained in simple language to help you understand what information is required.',
      formPreview: 'Form Preview',
      continueButton: 'Continue to Supporting Documents',
      errorProcessing: 'Failed to process the form. Please try again.',
    },
    hi: {
      title: 'फ़ॉर्म समझ',
      description:
        'AI ने आपके फ़ॉर्म का विश्लेषण किया है और नीचे फ़ील्ड्स की पहचान की है। प्रत्येक फ़ील्ड को सरल भाषा में समझाया गया है ताकि आप जान सकें कि किस जानकारी की आवश्यकता है।',
      formPreview: 'फ़ॉर्म प्रीव्यू',
      continueButton: 'सहायक दस्तावेजों के लिए आगे बढ़ें',
      errorProcessing: 'फ़ॉर्म को प्रोसेस करने में विफल रहा। कृपया फिर से प्रयास करें।',
    },
    mr: {
      title: 'फॉर्म समज',
      description:
        'AI ने तुमचा फॉर्मanalyse केले आहे आणि खालील फील्ड्स ओळखले आहेत. प्रत्येक फील्ड सोप्या भाषेत समजलेला आहे जेणेकरून तुम माहिती काय हवी आहे ते जाणू शकता.',
      formPreview: 'फॉर्म previeuw',
      continueButton: 'सहायक दस्तऐवजांसाठी पुढे जा',
      errorProcessing: 'फॉर्म प्रोसेस करण्यात अयशिवल रहा. कृपया पुन्हा प्रयत्न करा.',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  // Separate function to handle form processing with state updates
  const processFormWithState = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const fields = await processForm(formData.formUrl!);
      // Convert mock fields to our form field format
      const formFields = fields.map(field => ({
        id: field.id,
        label: field.label,
        description: field.description,
        value: null,
        status: 'not_reviewed' as const,
        sourceDocuments: [],
        conflictingValues: [],
      }));
      setFormData(prev => ({
        ...prev,
        formFields,
      }));
    } catch (err) {
      console.error('Error processing form:', err);
      setError(lang.errorProcessing);
    } finally {
      setIsProcessing(false);
    }
  }, [formData.formUrl, lang.errorProcessing, setFormData]);

  // Process form when formUrl changes
  // Setting loading state and clearing error before async operation is acceptable
  useEffect(() => {
    // If we have a form URL but haven't processed it yet, process it
    if (formData.formUrl && !formData.formFields) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      processFormWithState();
    }
  }, [formData.formUrl, language, formData.formFields, lang.errorProcessing, processFormWithState]);

  if (!formData.formUrl) {
    // If no form URL, redirect back to upload
    return <p>No form uploaded. <Link href="/form-upload">Go back</Link></p>;
  }

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

        {isProcessing && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-200 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {formData.formFields && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {lang.formPreview}
              </h2>
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                {/* Using a div with fixed aspect ratio as workaround for unknown image dimensions */}
                <div className="relative w-full pt-[60%]">
                  <Image
                    src={formData.formUrl}
                    alt="Uploaded form"
                    className="absolute inset-0 max-w-full h-auto rounded-lg"
                    // Note: Since we don't know the actual dimensions of the uploaded form,
                    // we're using a workaround. In a production app, you might want to:
                    // 1. Get the actual dimensions after loading the image
                    // 2. Use a placeholder with blur effect
                    // 3. Or accept that we don't have optimization for this specific use case
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {formData.formFields.map((field) => (
                <div key={field.id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {field.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {field.description}
                  </p>
                  {/* In the next step, we'll add an input for the user to enter a value,
                  but for now we just show the field info. */}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Link
                href="/supporting-documents"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
              >
                {lang.continueButton}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}