'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export type FormData = {
  formUrl: string | null;
  formFields: FormField[] | null;
};

export type FormField = {
  id: string;
  label: string;
  description: string; // AI explanation in simple language
  value: string | null; // user's entered value
  status: 'not_reviewed' | 'extracted' | 'needs_confirmation' | 'missing' | 'unreadable' | 'conflict_detected' | 'user_confirmed' | 'user_corrected';
  sourceDocuments: string[]; // list of document IDs that provided a value for this field
  conflictingValues: Array<{
    documentId: string;
    value: string;
  }>;
};

export type SupportingDocument = {
  id: string;
  name: string;
  url: string; // local URL for preview
  status: 'uploading' | 'processed' | 'error';
  extractedValues: ExtractedValue[]; // values extracted from this document
};

export type ExtractedValue = {
  fieldId: string; // maps to a form field
  value: string;
  confidence: number; // 0-1, but we won't use it for decision, just for display maybe
  sourceText: string; // the text in the document that was extracted
  sourceRegion?: { x: number, y: number, width: number, height: number }; // if available
};

type AppContextType = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  supportingDocuments: SupportingDocument[];
  setSupportingDocuments: React.Dispatch<React.SetStateAction<SupportingDocument[]>>;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    formUrl: null,
    formFields: null,
  });
  const [supportingDocuments, setSupportingDocuments] = useState<SupportingDocument[]>([]);
  const [language, setLanguage] = useState<Language>('en'); // default to English

  const value = {
    formData,
    setFormData,
    supportingDocuments,
    setSupportingDocuments,
    language,
    setLanguage
  };

  return (
    <AppContext.Provider value={value} >
      {children}
    </AppContext.Provider>
  );
}