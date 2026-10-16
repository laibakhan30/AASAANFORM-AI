# PatraPilot AI

**Understand every field. Fill with confidence.**

PatraPilot AI is an open-source, AI-powered form understanding and assisted form completion tool designed to help people who struggle with unfamiliar forms, such as government documents, applications, and contracts.

## Features

- **Multilingual Interface**: Supports English, Hindi, and Marathi (with easy language switching)
- **Form Understanding**: Upload a form image or PDF and get AI-powered explanations of each field in simple language
- **Document Processing**: Upload supporting documents (identity proof, birth certificate, etc.) to extract relevant information
- **Smart Extraction**: AI extracts values from your documents and maps them to form fields
- **Verification & Review**: Review extracted values, confirm correct information, correct errors, or leave fields blank
- **Final Draft**: Generate a printable draft of the completed form with clear warnings for any unresolved fields
- **Privacy-Focused**: All processing happens locally or via secure APIs; no permanent storage of personal data
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Demo Scenarios

The application includes three demo scenarios that can be tested:

1. **Complete Fictional Profile**: All necessary information is present in the supporting documents
2. **Missing Information**: Some required information is missing from the documents
3. **Conflicting Information**: Supporting documents contain contradictory information for the same field

## Technology Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **AI**: Gemma 4 (via hosted API or local inference)
- **State Management**: React Context
- **Styling**: Tailwind CSS with custom color scheme
- **Icons**: Heroicons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) API key for a Gemma 4 provider if you want to use live AI features

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PatraPilot-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your API key(s) for the Gemma 4 provider you plan to use
   - For example, if using Google's Generative AI API:
     ```
     GOOGLE_API_KEY=your_google_api_key_here
     ```

### Running the Application

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

```
PatraPilot-AI/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── form-upload/     # Form upload page
│   │   ├── form-understanding/ # Form understanding page
│   │   ├── supporting-documents/ # Supporting documents upload
│   │   ├── extraction-mapping/ # Extraction and field mapping
│   │   ├── verification-review/ # Verification and review
│   │   ├── final-draft/     # Final draft preview and print
│   │   ├── privacy/         # Privacy policy page
│   │   ├── about/           # About page
│   │   └── lang/            # Language selection page
│   ├── lib/                 # Library code
│   │   ├── ai/              # AI provider and prompts
│   │   ├── app-context.ts   # React context for global state
│   │   ├── i18n/            # Internationalization (placeholder)
│   │   └── ...              # Other utility libraries
│   ├── components/          # Reusable components
│   │   ├── forms/           # Form-related components
│   │   ├── documents/       # Document-related components
│   │   └── verification/    # Verification-related components
│   ├── public/              # Static assets
│   │   └── demo/            # Demo files (fictional documents and forms)
│   ├── types/               # TypeScript type definitions
│   └── styles/              # CSS and Tailwind configuration
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # Technical architecture
│   ├── PRIVACY.md           # Detailed privacy policy
│   ├── AI_MODEL.md          # Information about the Gemma model used
│   ├── HACKATHON_REQUIREMENTS.md # Hackathon-specific requirements
│   └── TESTING.md           # Testing procedures and results
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore file
├── package.json             # npm dependencies and scripts
└── README.md                # This file
```

## How It Works

1. **Form Upload**: Upload an image or PDF of the form you need to fill out.
2. **Form Understanding**: The AI analyzes the form and explains each field in simple language (available in English, Hindi, or Marathi).
3. **Supporting Documents**: Upload images or PDFs of your supporting documents (e.g., ID, birth certificate).
4. **Extraction & Mapping**: The AI extracts information from your documents and maps it to the form fields.
5. **Verification & Review**: Review each field's extracted value, confirm if correct, correct if wrong, or leave blank if unknown.
6. **Final Draft**: View a preview of your completed form, print it, or save as PDF. Unresolved fields are clearly marked.

## AI Integration

PatraPilot AI uses Gemma 4 for natural language understanding tasks:
- Explaining form field labels and instructions in simple language
- Extracting key-value pairs from supporting documents
- Mapping document information to form fields

The application is designed to work with any Gemma 4 provider. By default, it includes mock AI responses for demonstration. To use live AI features, you need to:
1. Obtain an API key from a Gemma 4 provider (e.g., Google's Generative AI API, Replicate, etc.)
2. Add the key to your `.env.local` file
3. Implement the actual API calls in `lib/ai/provider.ts`

## Privacy & Security

- No personal data is permanently stored
- All file processing happens in the browser or via secure API calls
- Uploaded files are only kept in memory for the duration of the session
- The application does not claim to be an official government service
- All outputs are clearly marked as drafts for demonstration purposes only

## Hackathon Requirements

This project was created for Poona College CodeCraft 2026 and aims to satisfy the following criteria:
- Best Use of Gemma 4
- Best Open-Source AI Project

See `docs/HACKATHON_REQUIREMENTS.md` for details on how the project meets verified requirements.

## Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for guidelines on how to contribute to this project.

## License

This project is licensed under the Apache License 2.0 - see the `LICENSE` file for details.

## Acknowledgments

- Gemma 4 team for creating the open-weight model
- Poona College CodeCraft 2026 organizers
- Open-source community for the tools and libraries used