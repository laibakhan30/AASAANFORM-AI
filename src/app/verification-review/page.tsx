'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import Link from 'next/link';

// Dummy component for ArrowLeft
const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9L9 15.75m0 0L2.25 9m13.5 0h-13.5a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75v9a2.25 2.25 0 01-2.25 2.25z" />
  </svg>
);

export default function VerificationReview() {
  const { formData, setFormData, supportingDocuments, language } = useAppContext();
  const [error, setError] = useState<string | null>(null);

  // Helper to get the suggested value for a field (the first extracted value if available, or empty)
  function getSuggestedValue(fieldId: string): string {
    // In a real app, we might have a more sophisticated way to choose a suggested value.
    // For now, we'll just take the first extracted value from the first document.
    for (const doc of supportingDocuments) {
      if (doc.status !== 'processed') continue;
      for (const val of doc.extractedValues) {
        if (val.fieldId === fieldId) {
          return val.value;
        }
      }
    }
    return '';
  }

  // Helper to get all distinct extracted values for a field
  function getDistinctValues(fieldId: string): Array<{ documentId: string; value: string }> {
    const values: Array<{ documentId: string; value: string }> = [];
    const seen = new Set<string>();
    for (const doc of supportingDocuments) {
      if (doc.status !== 'processed') continue;
      for (const val of doc.extractedValues) {
        if (val.fieldId === fieldId && !seen.has(val.value)) {
          seen.add(val.value);
          values.push({ documentId: doc.id, value: val.value });
        }
      }
    }
    return values;
  }

  // Texts for this page
  const t = {
    en: {
      title: 'Verification & Review',
      description:
        'Review each field below and confirm the value, correct it, or leave it blank. Fields that are confirmed will appear in the final draft.',
      fieldLabel: 'Field',
      statusLabel: 'Status',
      currentValueLabel: 'Current Value:',
      extractedFromLabel: 'Extracted from Documents:',
      conflictingValuesLabel: 'Conflicting Values:',
      confirmButton: 'Confirm',
      correctButton: 'Correct',
      leaveBlankButton: 'Leave Blank',
      missingInfo: 'No information found in your documents for this field.',
      conflictInfo: 'Conflicting information found. Please review the values above and enter the correct one.',
      unreadableInfo: 'The information in your document is unclear or unreadable for this field.',
      continueButton: 'Continue to Final Draft',
    },
    hi: {
      title: 'सत्यापन & समीक्षा',
      description:
        'कृपया नीचे दिए गए प्रत्येक फ़ील्ड की जाँच करें और मूल्य की पुष्टि करें, उसे सही करें, या रिक्त छोड़ें। पुष्टि की गई फ़ील्ड अंतिम ड्राफ्ट में दिखाई देंगी।',
      fieldLabel: 'फ़ील्ड',
      statusLabel: 'स्थिति',
      currentValueLabel: 'वर्तमान मूल्य:',
      extractedFromLabel: 'दस्तावेज़ों से निकाला गया:',
      conflictingValuesLabel: 'विपरीत मूल्य:',
      confirmButton: 'पुष्टि करें',
      correctButton: 'सही करें',
      leaveBlankButton: 'रिक्त छोड़ें',
      missingInfo: 'आपके दस्तावेज़ों में इस फ़ील्ड के लिए कोई जानकारी नहीं मिली।',
      conflictInfo: 'आपके दस्तावेज़ों में विरोधाभासी जानकारी मिली है। कृपया ऊपर दिए गए मानों की समीक्षा करें और सही मान दर्ज करें।',
      unreadableInfo: 'आपके दस्तावेज़ में इस फ़ील्ड के लिए जानकारी अस्पष्ट या अपठनीय है।',
      continueButton: 'अंतिम ड्राफ्ट के लिए आगे बढ़ें',
    },
    mr: {
      title: 'सत्यापन व पुनरावलोकन',
      description:
        'कृपया खालील प्रत्येक फील्ड يا तेवा जसॉस रहा: ख्रिस्तचा मूल्य पुष्टी करा, तेवींuret करा, किंवा रिकट ठेवा. पुष्टी केलेले फील्ड्स अंतिम ड्राफ्ट मध्ये दिसतील.',
      fieldLabel: 'फील्ड',
      statusLabel: 'स्थिती',
      currentValueLabel: 'चालू मूल्य:',
      extractedFromLabel: 'दस्तऐवजांमधून estrat:',
      conflictingValuesLabel: 'विरोधी मूल्य:',
      confirmButton: 'पुष्टी करा',
      correctButton: 'सुधार करा',
      leaveBlankButton: 'रिकट ठेवा',
      missingInfo: 'तुमच्या दस्तऐवजांमध्ये हा फील्ड रिकट आहे.',
      conflictInfo: 'तुमच्या दस्तऐवजांमध्ये विरोधी माहिती मिळाली आहे. कृपया वरील मूल्ये तपासा व प्रयत्न करा.',
      unreadableInfo: 'तुमच्या दस्तऐवजात हा फील्ड अव स्पष्ट किंवा अव वाचणयोग्य आहे.',
      continueButton: 'अंतिम ड्राफ्ट artefacter पुढे जा',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  const handleConfirm = (fieldId: string) => {
    setFormData(prev => {
      const updatedFields = [...prev.formFields];
      const fieldIndex = updatedFields.findIndex(f => f.id === fieldId);
      if (fieldIndex !== -1) {
        // If the field already has a value (from user input or extracted), we confirm it.
        // If it doesn't have a value, confirming means we keep it empty.
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          status: 'user_confirmed',
        };
      }
      return {
        ...prev,
        formFields: updatedFields,
      };
    });
  };

  const handleCorrect = (fieldId: string, newValue: string) => {
    setFormData(prev => {
      const updatedFields = [...prev.formFields];
      const fieldIndex = updatedFields.findIndex(f => f.id === fieldId);
      if (fieldIndex !== -1) {
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          value: newValue,
          status: newValue === '' ? 'not_reviewed' : 'user_corrected',
        };
      }
      return {
        ...prev,
        formFields: updatedFields,
      };
    });
  };

  const handleLeaveBlank = (fieldId: string) => {
    setFormData(prev => {
      const updatedFields = [...prev.formFields];
      const fieldIndex = updatedFields.findIndex(f => f.id === fieldId);
      if (fieldIndex !== -1) {
        updatedFields[fieldIndex] = {
          ...updatedFields[fieldIndex],
          value: '',
          status: 'not_reviewed',
        };
      }
      return {
        ...prev,
        formFields: updatedFields,
      };
    });
  };

  if (!formData.formFields) {
    return <p>Loading form data... <Link href="/extraction-mapping">Go back</Link></p>;
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

        {error && (
          <div className="bg-red-50 border-l-4 border-red-200 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-6">
          {formData.formFields.map((field) => (
            <div key={field.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {/* Status indicator */}
                  <div className={`h-3 w-3 rounded-full ${
                    field.status === 'user_confirmed'
                      ? 'bg-green-500'
                      : field.status === 'user_corrected'
                      ? 'bg-blue-500'
                      : field.status === 'needs_confirmation'
                      ? 'bg-yellow-500'
                      : field.status === 'missing'
                      ? 'bg-red-500'
                      : field.status === 'conflict_detected'
                      ? 'bg-orange-500'
                      : field.status === 'unreadable'
                      ? 'bg-purple-500'
                      : 'bg-gray-500'
                  }`}></div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {field.label}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {field.description}
                  </p>

                  {/* Show the current value (if any) */}
                  {field.value !== null && field.value !== '' && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        {lang.currentValueLabel}
                      </p>
                      <p className="pl-4 text-sm text-gray-900">
                        {field.value}
                      </p>
                    </div>
                  )}

                  {/* Show extracted values and source documents for reference */}
                  {field.sourceDocuments.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        {lang.extractedFromLabel}
                      </p>
                      <div className="ml-4 space-y-1">
                        {field.sourceDocuments.map((docId, index) => {
                          const doc = supportingDocuments.find(d => d.id === docId);
                          const value = field.conflictingValues[index]?.value;
                          return (
                            <div key={`${docId}-${index}`} className="flex items-start space-x-2 text-sm">
                              <div className="flex-shrink-0 mt-0.5">•</div>
                              <div>
                                {doc?.name || 'Unknown Document'}{' '}
                                {value !== undefined ? `(${value})` : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Show conflicting values if any */}
                  {field.conflictingValues.length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-700 mb-2">
                        {lang.conflictingValuesLabel}
                      </p>
                      {field.conflictingValues.map((conflict, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm text-red-600">
                          <div className="flex-shrink-0 mt-0.5">•</div>
                          <div>
                            {conflict.documentId}: {conflict.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-4 space-y-3">
                    {/* Show different actions based on status */}
                    {field.status === 'user_confirmed' || field.status === 'user_corrected' ? (
                      <>
                        <button
                          onClick={() => handleLeaveBlank(field.id)}
                          className="w-full flex items-center justify-start px-3 py-2 text-sm text-left text-red-600 hover:text-red-800"
                        >
                          {lang.leaveBlankButton}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleConfirm(field.id)}
                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                          >
                            {lang.confirmButton}
                          </button>
                          <button
                            onClick={() => {
                                    // We'll open a prompt to correct the value
                                    // For simplicity, we'll just set the status to needs_confirmation and let them edit in the next step?
                                    // But we want to correct here.
                                    // We'll use a simple prompt.
                                    const newValue = window.prompt('Enter the correct value:', field.value || '');
                                    if (newValue !== null) {
                                      handleCorrect(field.id, newValue);
                                    }
                                  }}
                            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md"
                          >
                            {lang.correctButton}
                          </button>
                        {field.value === '' && (
                          <div>
                            <button
                              onClick={() => handleLeaveBlank(field.id)}
                              className="w-full px-3 py-2 text-sm text-left text-red-600 hover:text-red-800"
                            >
                              {lang.leaveBlankButton}
                            </button>
                          </div>
                        )}
                      </div>
                      </>
                    )}

                    {/* Special handling for missing fields */}
                    {field.status === 'missing' && (
                      <p className="mt-2 text-sm text-red-600">
                        {lang.missingInfo}
                      </p>
                    )}

                    {/* Special handling for conflict detected */}
                    {field.status === 'conflict_detected' && (
                      <p className="mt-2 text-sm text-orange-600">
                        {lang.conflictInfo}
                      </p>
                    )}
                </div>
              </div>
            </div>
          ))}
        </form>

        <div className="mt-8 flex justify-end">
          <Link
            href="/final-draft"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            {lang.continueButton}
          </Link>
        </div>
      </div>
    </div>
  );
}