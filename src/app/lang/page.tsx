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

export default function LanguageSelect() {
  const { setLanguage, language } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value as 'en' | 'hi' | 'mr';
    setIsSaving(true);
    setLanguage(selectedLanguage);
    // Give a moment for the state to update, then redirect
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
  ];

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
          Select Language
        </h1>
        <p className="text-gray-600 mb-6">
          Choose your preferred language for the interface.
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language:
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isSaving && (
          <div className="mt-4 text-center">
            <p className="text-sm text-indigo-600">
Saving language...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}