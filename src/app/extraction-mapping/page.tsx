'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/app-context';
import Link from 'next/link';

// Helper to get the best value for a field from supporting documents
type FieldValueFromDoc = {
  documentId: string;
  value: string;
  confidence: number;
};

function getFieldValuesFromDocuments(
  fieldId: string,
  supportingDocuments: SupportingDocument[]
): FieldValueFromDoc[] {
  const values: FieldValueFromDoc[] = [];
  for (const doc of supportingDocuments) {
    if (doc.status !== 'processed') continue;
    for (const val of doc.extractedValues) {
      if (val.fieldId === fieldId) {
        values.push({
          documentId: doc.id,
          value: val.value,
          confidence: val.confidence,
        });
      }
    }
  }
  return values;
}

function determineFieldStatus(
  fieldId: string,
  supportingDocuments: SupportingDocument[]
): {
  status: 'not_reviewed' | 'extracted' | 'needs_confirmation' | 'missing' | 'unreadable' | 'conflict_detected' | 'user_confirmed' | 'user_corrected';
  values: FieldValueFromDoc[];
  hasConflict: boolean;
} {
  const values = getFieldValuesFromDocuments(fieldId, supportingDocuments);

  if (values.length === 0) {
    return {
      status: 'missing',
      values: [],
      hasConflict: false,
    };
  }

  // Check for conflicts: if there are different values with reasonable confidence
  const uniqueValues = Array.from(new Set(values.map(v => v.value)));
  if (uniqueValues.length > 1) {
    // We have conflicting values
    return {
      status: 'conflict_detected',
      values,
      hasConflict: true,
    };
  }

  // If we have at least one value, we consider it extracted.
  // In a real app, we might check confidence or readability.
  return {
    status: 'extracted',
    values,
    hasConflict: false,
  };
}

export default function ExtractionMapping() {
  const { formData, setFormData, supportingDocuments, language } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Texts for this page
  const t = {
    en: {
      title: 'Extraction & Mapping',
      description:
        'The AI has extracted information from your supporting documents and mapped it to the form fields. Review each field below to confirm, correct, or leave blank.',
      fieldLabel: 'Field',
      statusLabel: 'Status',
      valueLabel: 'Value',
      sourceDocumentsLabel: 'Source Documents',
      conflictingValuesLabel: 'Conflicting Values',
      enterValueLabel: 'Enter or confirm the value for this field:',
      suggestedValueLabel: 'Suggested:',
      missingInfo: 'No information found in your documents for this field.',
      conflictInfo: 'Conflicting information found. Please review the values above and enter the correct one.',
      unreadableInfo: 'The information in your document is unclear or unreadable for this field.',
      continueButton: 'Continue to Verification & Review',
      errorProcessing: 'Failed to process extraction data. Please try again.',
    },
    hi: {
      title: 'निष्कर्षण & मानचित्रण',
      description:
        'AI ने आपके सहायक दस्तावेज़ों से जानकारी निकाली है और उसे फ़ॉर्म फ़ील्ड्स में मैप किया है। कृपया नीचे प्रत्येक फ़ील्ड की समीक्षा करें ताकि आप पुष्टि कर सकें, सुधार सकें, या रिक्त रख सकें।',
      fieldLabel: 'फ़ील्ड',
      statusLabel: 'स्थिति',
      valueLabel: 'मूल्य',
      sourceDocumentsLabel: 'स्रोत दस्तावेज़',
      conflictingValuesLabel: 'विपरीत मूल्य',
      enterValueLabel: 'इस फ़ील्ड के लिए मान दर्ज करें या पुष्टि करें:',
      suggestedValueLabel: 'सुझाव दिया गया:',
      missingInfo: 'आपके दस्तावेज़ों में इस फ़ील्ड के लिए कोई जानकारी नहीं मिली।',
      conflictInfo: 'आपके दस्तावेज़ों में विरोधाभासी जानकारी मिली है। कृपया ऊपर दिए गए मानों की समीक्षा करें और सही मान दर्ज करें।',
      unreadableInfo: 'आपके दस्तावेज़ में इस फ़ील्ड के लिए जानकारी अस्पष्ट या अपठनीय है।',
      continueButton: 'सत्यापन एवं समीक्षा के लिए आगे बढ़ें',
      errorProcessing: 'निष्कर्षण डेटा को प्रोसेस करने में विफल रहा। कृपया फिर से प्रयास करें।',
    },
    mr: {
      title: 'निष्कर्षण & मानचित्रण',
      description:
        'AI ने तुमच्या सहायक दस्तऐवजांमधील माहिती काढली आहे आणि तिला फॉर्म फील्ड्समध्ये मॅप केला आहे. कृपया खालील प्रत्येक फील्ड saldo tweak करा ज्यामुळे तुम पुष्टी करू शकता, सुधारू शकता, किंवा रिकट ठेवू शकता.',
      fieldLabel: 'फील्ड',
      statusLabel: 'स्थिती',
      valueLabel: 'मूल्य',
      sourceDocumentsLabel: 'स्रोत दस्तऐवज',
      conflictingValuesLabel: 'विरोधी मूल्य',
      enterValueLabel: 'हे फील्डसाठी मूल्य ينشا करा किंवा certeza करा:',
      suggestedValueLabel: 'सुचवित:',
      missingInfo: 'तुमच्या दस्तऐवजांमधील हा फील्ड रिकट आहे.',
      conflictInfo: 'तुमच्या दस्तऐवजांमध्ये विरोधी माहिती मिळाली आहे. कृपया वरील मूल्ये तपासा व प्रयत्न करा.',
      unreadableInfo: 'तुमच्या दस्तऐवजात हा फील्ड अव स्पष्ट किंवा अव वाचणयोग्य आहे.',
      continueButton: 'सत्यापन व पुनरावलोकन artefacter पुढे जा',
      errorProcessing: 'निष्कर्षण डेटा प्रक्रिया करण्यास अयशिवल राहिलं. कृपया पुन्हा प्रयत्न करा.',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  useEffect(() => {
    // If we have form fields and supporting documents, we need to update the form data
    // with the extracted values and statuses.
    if (formData.formFields && supportingDocuments.length > 0) {
      setIsProcessing(true);
      setError(null);

      try {
        // Create a copy of the form fields
        const updatedFields = formData.formFields.map((field) => {
          const { status, values, hasConflict } = determineFieldStatus(field.id, supportingDocuments);

          // If there's a conflict, we might want to show all values and let the user choose.
          // For now, we'll keep the value as null and let the user decide in the verification step.
          // We'll set the status accordingly.

          return {
            ...field,
            status: status === 'not_reviewed' ? field.status : status, // preserve user-confirmed/corrected
            // We don't set the value here because we want the user to confirm in the next step.
            // We'll store the extracted values in the field's sourceDocuments and conflictingValues.
            sourceDocuments: values.map(v => v.documentId),
            conflictingValues: hasConflict
              ? values.map(v => ({ documentId: v.documentId, value: v.value }))
              : [],
          };
        });

        setFormData(prev => ({
          ...prev,
          formFields: updatedFields,
        }));
        setIsProcessing(false);
      } catch (err) {
        console.error('Error updating field statuses:', err);
        setError(lang.errorProcessing);
        setIsProcessing(false);
      }
    }
  }, [formData.formFields, supportingDocuments, setFormData, language]);

  if (!formData.formFields) {
    // If we don't have form fields yet, we might be waiting for processing or there was an error.
    return <p>Loading form fields... <Link href="/form-understanding">Go back</Link></p>;
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

                  {/* Show extracted values and source documents */}
                  {field.sourceDocuments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {lang.sourceDocumentsLabel}
                      </p>
                      <div className="space-y-1">
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
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
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

                  {/* Input for the user to enter or correct the value */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {lang.enterValueLabel}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        // We'll use the field's value if it's been set by the user, otherwise we can show a suggested value
                        defaultValue={field.value ?? ''}
                        onChange={(e) => {
                          // Update the field value in the context
                          setFormData(prev => {
                            const updatedFields = [...prev.formFields];
                            const fieldIndex = updatedFields.findIndex(f => f.id === field.id);
                            if (fieldIndex !== -1) {
                              updatedFields[fieldIndex] = {
                                ...updatedFields[fieldIndex],
                                value: e.target.value,
                                status: e.target.value === '' ? 'not_reviewed' : 'needs_confirmation',
                              };
                            }
                            return {
                              ...prev,
                              formFields: updatedFields,
                            };
                          }
                          }
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {/* Show a suggested value if available */}
                      {field.value && (
                        <p className="mt-1 text-xs text-gray-500">
                          {lang.suggestedValueLabel} {field.value}
                        )
                      )}
                    </div>

                    {/* Show status message based on field status */}
                    {field.status === 'missing' && (
                      <p className="mt-2 text-sm text-red-600">
                        {lang.missingInfo}
                      </p>
                    )}
                    {field.status === 'conflict_detected' && (
                      <p className="mt-2 text-sm text-orange-600">
                        {lang.conflictInfo}
                      </p>
                    )}
                    {field.status === 'unreadable' && (
                      <p className="mt-2 text-sm text-purple-600">
                        {lang.unreadableInfo}
                      </p>
                    )}
                  }
                </div>
              </div>
            </div>
          ))}
        </form>

        <div className="mt-8 flex justify-end">
          <Link
            href="/verification-review"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            {lang.continueButton}
          </Link>
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