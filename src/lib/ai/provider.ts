// AI Provider Interface
// This file defines the interface for AI services and provides mock implementations
// For production, replace the mock functions with actual API calls to your Gemma 4 provider

import { FormField, SupportingDocument, ExtractedValue } from '@/lib/app-context';

// Mock AI responses for demonstration
// In a real implementation, these would call your Gemma 4 API

// Mock form processing
export async function processFormImage(formUrl: string): Promise<FormField[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock data for a fictional SIR-style form
  return [
    {
      id: 'field1',
      label: 'पूरा नाम (Full Name)',
      description: 'अपना पूरा नाम लिखें जैसे कि आपके पहचान दस्तावेज में है।',
      value: null,
      status: 'not_reviewed',
      sourceDocuments: [],
      conflictingValues: [],
    },
    {
      id: 'field2',
      label: 'जन्म तिथि (Date of Birth)',
      description: 'DD/MM/MMYY प्रारूप में अपनी जन्म तिथि लिखें।',
      value: null,
      status: 'not_reviewed',
      sourceDocuments: [],
      conflictingValues: [],
    },
    {
      id: 'field3',
      label: 'पिता का नाम (Father\'s Name)',
      description: 'अपके पिता का पूरा नाम लिखें।',
      value: null,
      status: 'not_reviewed',
      sourceDocuments: [],
      conflictingValues: [],
    },
    {
      id: 'field4',
      label: 'माता का नाम (Mother\'s Name)',
      description: 'अपकी माता का पूरा नाम लिखें।',
      value: null,
      status: 'not_reviewed',
      sourceDocuments: [],
      conflictingValues: [],
    },
    {
      id: 'field5',
      label: 'पता (Address)',
      description: 'अपका वर्तमान पता लिखें।',
      value: null,
      status: 'not_reviewed',
      sourceDocuments: [],
      conflictingValues: [],
    },
    {
      id: 'field6',
      label: 'पिन कोड (PIN Code)',
      description: 'अपके क्षेत्र का 6 अंकों का पिन कोड लिखें।',
      value: null,
      status: 'not_reviewed',
      sourceDocuments: [],
      conflictingValues: [],
    },
  ];
}

// Mock document processing
export async function processDocument(file: File): Promise<ExtractedValue[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock extracted values
  // In a real implementation, this would use OCR or document understanding AI
  return [
    {
      fieldId: 'field1', // Full Name
      value: 'Kiran Demo',
      confidence: 0.95,
      sourceText: 'Kiran Demo',
    },
    {
      fieldId: 'field2', // Date of Birth
      value: '15/08/1990',
      confidence: 0.9,
      sourceText: '15/08/1990',
    },
    {
      fieldId: 'field3', // Father's Name
      value: 'Mohan Demo',
      confidence: 0.92,
      sourceText: 'Mohan Demo',
    },
    {
      fieldId: 'field4', // Mother's Name
      value: 'Sita Demo',
      confidence: 0.93,
      sourceText: 'Sita Demo',
    },
    {
      fieldId: 'field5', // Address
      value: '123, Main Street, Anytown',
      confidence: 0.88,
      sourceText: '123, Main Street, Anytown',
    },
    {
      fieldId: 'field6', // PIN Code
      value: '110001',
      confidence: 0.97,
      sourceText: '110001',
    },
  ];
}

// Function to determine field status based on extracted values
// This is used in the extraction-mapping page
export function determineFieldStatus(
  fieldId: string,
  supportingDocuments: SupportingDocument[]
) {
  // Collect all extracted values for this field from all documents
  const values: { documentId: string; value: string; confidence: number }[] = [];

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

  if (values.length === 0) {
    return {
      status: 'missing' as const,
      values: [],
      hasConflict: false,
    };
  }

  // Check for conflicting values (different values with reasonable confidence)
  const uniqueValues = Array.from(new Set(values.map(v => v.value)));
  if (uniqueValues.length > 1) {
    return {
      status: 'conflict_detected' as const,
      values,
      hasConflict: true,
    };
  }

  // If we have at least one value, consider it extracted
  return {
    status: 'extracted' as const,
    values,
    hasConflict: false,
  };
}

// Function to get suggested value for a field (first extracted value)
export function getSuggestedValue(fieldId: string, supportingDocuments: SupportingDocument[]): string {
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

// Function to get all distinct values for a field (for conflict resolution)
export function getDistinctValues(fieldId: string, supportingDocuments: SupportingDocument[]): Array<{ documentId: string; value: string }> {
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