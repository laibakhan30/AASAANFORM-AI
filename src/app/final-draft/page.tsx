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

export default function FinalDraft() {
  const { formData, supportingDocuments, language } = useAppContext();
  const [showWarning, setShowWarning] = useState(false);

  // Count fields by status
  const fieldCounts = {
    confirmed: 0,
    corrected: 0,
    needsConfirmation: 0,
    missing: 0,
    unreadable: 0,
    conflict: 0,
    notReviewed: 0,
  };

  formData.formFields?.forEach((field) => {
    switch (field.status) {
      case 'user_confirmed':
        fieldCounts.confirmed++;
        break;
    case 'user_corrected':
        fieldCounts.corrected++;
        break;
      case 'needs_confirmation':
        fieldCounts.needsConfirmation++;
        break;
      case 'missing':
        fieldCounts.missing++;
        break;
      case 'unreadable':
        fieldCounts.unreadable++;
        break;
      case 'conflict_detected':
        fieldCounts.conflict++;
        break;
      default:
        fieldCounts.notReviewed++;
        break;
    }
  });

  const hasUnconfirmedFields =
    fieldCounts.needsConfirmation > 0 ||
    fieldCounts.missing > 0 ||
    fieldCounts.unreadable > 0 ||
    fieldCounts.conflict > 0 ||
    fieldCounts.notReviewed > 0;

  const handlePrint = () => {
    // Trigger print dialog
    window.print();
  };

  const handleGoBack = () => {
    // We'll go back to the verification step to fix any issues
    // In a real app, we might want to go to the specific field that needs attention.
    // For simplicity, we'll go to verification review.
    window.history.back();
  };

  if (!formData.formFields) {
    return <p>Loading form data... <Link href="/verification-review">Go back</Link></p>;
  }

  // Texts for this page
  const t = {
    en: {
      title: 'Final Draft',
      description:
        'Review your completed form below. You can print or save this draft as a PDF.',
      warningTitle: 'Attention: Some fields require your attention',
      warningMessage:
        '{needsConfirmation} fields need confirmation, {missing} fields are missing information, {unreadable} fields have unreadable data, {conflict} fields have conflicting information. Please review these fields before finalizing.',
      warningButton: 'Go Back to Review',
      formPreview: 'Form Preview',
      summaryTitle: 'Summary',
      confirmedLabel: 'Confirmed:',
      correctedLabel: 'Corrected:',
      needsConfirmationLabel: 'Needs Confirmation:',
      missingLabel: 'Missing:',
      unreadableLabel: 'Unreadable:',
      conflictingLabel: 'Conflicting:',
      disclaimerTitle: 'Important Disclaimer',
      disclaimerMessage:
        'DEMO ONLY — FICTIONAL DATA — NOT AN OFFICIAL GOVERNMENT FORM\nThis is a draft created for demonstration purposes only.\nIt does not guarantee acceptance by any government office.\nPlease review all information carefully before use.',
      backButton: '← Go Back to Review',
      printButton: 'Print Draft',
    },
    hi: {
      title: 'अंतिम ड्राफ्ट',
      description:
        'नीचे दिए गए पूर्ण फ़ॉर्म की समीक्षा करें। आप इस ड्राफ्ट को प्रिंट कर सकते हैं या इसे PDF के रूप में सहेज सकते हैं।',
      warningTitle: 'ध्यान दें: कुछ फ़ील्ड्स को आपके ध्यान की आवश्यकता है',
      warningMessage:
        '{needsConfirmation} फ़ील्ड्स की पुष्टि की आवश्यकता है, {missing} फ़ील्ड्स में जानकारी नहीं है, {unreadable} फ़ील्ड्स में अस्पष्ट या अपठनीय डेटा है, {conflict} फ़ील्ड्स में विरोधाभासी जानकारी है। अंतिम करने से पहले इन फ़ील्ड्स की समीक्षा करें।',
      warningButton: 'समीक्षा के लिए वापस जाएँ',
      formPreview: 'फ़ॉर्म प्रीव्यू',
      summaryTitle: 'सारांश',
      confirmedLabel: 'पुष्टि की गई:',
      correctedLabel: 'सुधार की गई:',
      needsConfirmationLabel: 'पुष्टि की प्रतीक्षा:',
      missingLabel: 'לא मिली:',
      unreadableLabel: 'अपठनीय:',
      conflictingLabel: 'विरोधी:',
      disclaimerTitle: 'महत्वपूर्ण अस्वीकरण',
      disclaimerMessage:
        'DEMO ONLY — FICTIONAL DATA — NOT AN OFFICIAL GOVERNMENT FORM\nयह एक ड्राफ्ट है जो केवल प्रदर्शन उद्देश्यों के लिए बनाया गया है।\nयह किसी भी सरकारी कार्यालय द्वारा स्वीकृति की गारंटी नहीं देता है।\nकृपया उपयोग करने से पहले सभी जानकारी को सावधानी से जाँचें।',
      backButton: '← समीक्षा के लिए वापस जाएँ',
      printButton: 'ड्राफ्ट प्रिंट करें',
    },
    mr: {
      title: 'अंतिम ड्राफ्ट',
      description:
        'तुमच्या पूर्ण फॉर्मचे दौरा द्या. तुम्ही हे ड्राफ्ट प्रिंट करू शकता किंवा ते PDF स्वरूपात conserved करू शकता.',
      warningTitle: 'ध्यान द्या: काही फील्ड्सला तुम्हारा ध्यान हवे.',
      warningMessage:
        '{needsConfirmation} फील्ड्ससाठी पुष्टी हवी आहे, {missing} फील्ड्समध्ये माहिती नाही, {unreadable} फील्ड्समध्ये अ clear किंवा अ वाचू शकते डेटा आहे, {conflict} फील्ड्समध्ये विरोधी माहिती आहे. अंतिम करण्यापूर्वी ही फील्ड्स बघा.',
      warningButton: 'परीक्षणासाठी परत जा',
      formPreview: 'फॉर्म previeuw',
      summaryTitle: 'सारांश',
      confirmedLabel: 'पुष्ट केलेली:',
      correctedLabel: 'सुधार केलेली:',
      needsConfirmationLabel: 'पुष्टी завиせて:',
      missingLabel: 'मिलाली नाही:',
      unreadableLabel: 'अव वाचू शकते:',
      conflictingLabel: 'विरोधी:',
      disclaimerTitle: 'महत्वपूर्ण अस्वीकरण',
      disclaimerMessage:
        'DEMO ONLY — FICTIONAL DATA — NOT AN OFFICIAL GOVERNMENT FORM\nही ड्राफ्ट केवल प्रदर्शन उद्देशांसाठी तयार केली आहे.\nहोतीं कोणत्याही शासकीय कार्यालयाने स्वीकृती देण्याची गारंटी नाही.\nकृपया वापरण्यापूर्वी सर्व माहिती सावधानीपूर्वे तौर पार करा.',
      backButton: '← परत जा तपासण्यासाठी',
      printButton: 'ड्राफ्ट प्रिंट करा',
    },
  };

  const lang = language === 'hi' ? t.hi : language === 'mr' ? t.mr : t.en;

  if (!formData.formFields) {
    return <p>Loading form data... <Link href="/verification-review">Go back</Link></p>;
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

        {/* Warning if there are unconfirmed fields */}
        {hasUnconfirmedFields && (
          <div className="bg-amber-50 border-l-4 border-amber-200 text-amber-700 p-4 mb-6">
            <h3 className="text-lg font-medium text-amber-800 mb-2">
              {lang.warningTitle}
            </h3>
            <p className="text-sm">
              {lang.warningMessage
                .replace('{needsConfirmation}', fieldCounts.needsConfirmation.toString())
                .replace('{missing}', fieldCounts.missing.toString())
                .replace('{unreadable}', fieldCounts.unreadable.toString())
                .replace('{conflict}', fieldCounts.conflict.toString())
              }
            </p>
            <button
              onClick={handleGoBack}
              className="mt-2 px-3 py-1 text-sm font-medium text-amber-800 bg-amber-200 hover:bg-amber-300 rounded"
            >
              {lang.warningButton}
            </button>
          </div>
        )}

        {/* Form preview */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          {/* We'll simulate a form layout. In a real app, we would map the fields to their positions on the form.
          For simplicity, we'll just list the fields with their labels and values. */}
          <div className="space-y-4">
            {formData.formFields.map((field) => (
              <div key={field.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-0.5 h-2.5 w-2.5">
                  {/* Status indicator for the draft */}
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    field.status === 'user_confirmed'
                      ? 'bg-green-500'
                      : field.status === 'user_corrected'
                      ? 'bg-blue-500'
                      : field.status === 'needs_confirmation'
                      ? 'bg-yellow-500'
                      : field.status === 'missing'
                      ? 'bg-red-500'
                      : field.status === 'unreadable'
                      ? 'bg-purple-500'
                      : field.status === 'conflict_detected'
                      ? 'bg-orange-500'
                      : 'bg-gray-500'
                  }`}></div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {field.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {field.value !== null && field.value !== '' ? (
                      field.value
                    ) : (
                      <span className="italic text-gray-400">
                        {field.status === 'missing'
                          ? lang.missingLabel
                          : field.status === 'unreadable'
                          ? lang.unreadableLabel
                          : field.status === 'conflict_detected'
                          ? lang.conflictingLabel
                          : lang.notReviewedLabel ?? 'Not confirmed'}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {lang.summaryTitle}
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{lang.confirmedLabel}</span>
              <span className="text-sm font-medium">{fieldCounts.confirmed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{lang.correctedLabel}</span>
              <span className="text-sm font-medium">{fieldCounts.corrected}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{lang.needsConfirmationLabel}</span>
              <span className="text-sm font-medium">{fieldCounts.needsConfirmation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{lang.missingLabel}</span>
              <span className="text-sm font-medium">{fieldCounts.missing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{lang.unreadableLabel}</span>
              <span className="text-sm font-medium">{fieldCounts.unreadable}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">{lang.conflictingLabel}</span>
              <span className="text-sm font-medium">{fieldCounts.conflict}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            {lang.disclaimerTitle}
          </h3>
          <p className="text-sm text-red-600" style={{ whiteSpace: 'pre-line' }}>
            {lang.disclaimerMessage}
          </p>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-between">
          <Link
            href="/verification-review"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {lang.backButton}
          </Link>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {lang.printButton}
            </button>
            {/* In a real app, we would generate a PDF and allow download.
            For now, we'll just use print to PDF via the browser. */}
          </div>
        </div>
      </div>
    </div>
  );
}