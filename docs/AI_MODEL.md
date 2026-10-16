# AI Model Information

## Model Used

PatraPilot AI is designed to work with Gemma 4, a family of open-weight language models created by Google.

### Gemma 4 Overview

Gemma 4 is a lightweight, state-of-the-art open model family from Google, designed for a variety of natural language processing tasks. The models are released under terms that allow for responsible commercial use and distribution.

### Model Variants

Gemma 4 comes in several sizes:
- Gemma 4B: 4 billion parameters
- Gemma 12B: 12 billion parameters
- Gemma 24B: 24 billion parameters

For our application, we primarily use the text-only variants for language understanding tasks.

## How We Use Gemma 4

In PatraPilot AI, Gemma 4 is used for the following tasks:

### 1. Form Field Explanation
- **Input**: Form field label and any associated instructions
- **Output**: A simple language explanation of what the field means and what information should be entered
- **Languages**: Explanations can be generated in English, Hindi, or Marathi based on user preference

### 2. Information Extraction from Documents
- **Input**: Image or PDF of a supporting document (e.g., ID card, birth certificate)
- **Output**: Structured data extracting key information such as names, dates, addresses, etc.
- **Format**: We extract values as text with associated field mappings

### 3. Semantic Mapping
- **Input**: Extracted values from documents and form field explanations
- **Output**: Mapping of document values to the appropriate form fields
- **Handling**: The model helps identify when different phrases refer to the same concept (e.g., "Date of Birth" and "DOB")

## Implementation Approach

### Current Status (Demo Version)

In the current demonstration version, we use mock AI responses to simulate the functionality of Gemma 4. This allows us to showcase the user interface and workflow without requiring actual API keys or model access.

### Production Implementation

For a production implementation, we would:

1. **Select a Provider**: Choose a hosted Gemma 4 API provider or set up local inference
2. **Secure API Keys**: Store API keys in environment variables (never in client-side code)
3. **Implement API Calls**: Create functions in `src/lib/ai/provider.ts` to:
   - Send form field information for explanation
   - Send document images for information extraction
   - Handle responses and map them to our internal data structures
4. **Add Error Handling**: Implement proper error handling for API failures, rate limits, and invalid responses
5. **Add Caching**: Where appropriate, cache API responses to reduce costs and improve performance
6. **Implement Fallbacks**: Provide graceful degradation when AI services are unavailable

### Provider Integration Examples

#### Google Generative AI API
```typescript
// Example structure for Google's API
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemma-4b-it" });

// For form field explanation
const result = await model.generateContent(
  `Explain this form field in simple ${language}: "${fieldLabel}". Instructions: "${fieldInstructions}"`
);

// For document extraction
const result = await model.generateContent([
  { text: "Extract all key information from this document in JSON format:" },
  { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
]);
```

#### Replicate API
```typescript
// Example structure for Replicate
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY
});

// For form field explanation
const output = await replicate.run(
  "google/gemma-4b-it:...",
  {
    input: {
      prompt: `Explain this form field in simple ${language}: "${fieldLabel}". Instructions: "${fieldInstructions}"`,
      max_length: 500
    }
  }
);
```

## Model Limitations and Considerations

While Gemma 4 is a powerful model, users should be aware of its limitations:

### 1. Accuracy
- The model may occasionally produce incorrect explanations or extractions
- Always verify AI-generated information against the original documents
- The application is designed to require human verification before finalizing any information

### 2. Language Support
- While Gemma 4 has multilingual capabilities, proficiency may vary between languages
- We currently focus on English, Hindi, and Marathi for the demo
- Quality may differ between these languages

### 3. Context Length
- Gemma 4 has a limited context window (typically 8192 tokens)
- Very long forms or documents may need to be processed in chunks
- The application currently assumes reasonably sized forms and documents

### 4. Bias and Fairness
- Like all AI models, Gemma 4 may exhibit biases present in its training data
- We have not implemented specific bias mitigation techniques
- Users should critically evaluate AI outputs, especially for sensitive information

## Responsible AI Use

PatraPilot AI is designed to promote responsible AI use:

1. **Human-in-the-Loop**: The application requires human verification at every step
2. **Transparency**: Users can see the original documents and AI-extracted values
3. **No Automated Decisions**: The AI never makes final decisions; all decisions require human confirmation
4. **Clear Disclaimers**: Outputs are clearly marked as demonstrations or drafts
5. **Privacy-Focused**: Minimizes data exposure and retention

## Acknowledgements

We acknowledge the Gemma 4 team at Google for creating and releasing this valuable open-weight model, which makes projects like ours possible.

For more information about Gemma 4, visit:
- Official website: https://ai.google.dev/gemma
- Model card: https://ai.google.dev/gemma/docs/core/model_card_4
- Responsible AI guide: https://ai.google.dev/responsibilities/responsible-ai-practices