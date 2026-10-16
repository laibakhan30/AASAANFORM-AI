# AasaanForm AI

**Understand every field. Fill with confidence.**

AasaanForm AI is an AI-powered form-understanding and assisted form-completion project designed to make unfamiliar forms easier to understand and complete, especially government forms and applications.

## Features

- **Multilingual support:** English, Hindi, and Marathi.
- **Form understanding:** Upload a form image or PDF to understand its fields and instructions.
- **Document processing:** Extract relevant information from supporting documents.
- **Smart extraction and mapping:** Map available information to the appropriate form fields.
- **Verification and review:** Check extracted information, correct errors, and leave unknown fields blank.
- **Final draft:** Review a draft before printing or using it.
- **Privacy-conscious design:** Avoid unnecessary storage of personal information.
- **Responsive interface:** A Next.js-based frontend.

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI
- **AI:** Gemma-based integration
- **State management:** React Context
- **Document processing:** OCR and PDF-processing utilities

## Getting Started

### Prerequisites

- Node.js and npm
- Python and pip
- A Python virtual environment
- An API key if required by the configured AI provider

### Start the frontend

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

### Start the backend

Activate your virtual environment and install the required Python dependencies.

If `backend.main:app` is your configured FastAPI entry point, run:

```powershell
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000/docs to inspect the available API endpoints.

### Environment variables

1. Copy `.env.example` to the environment file expected by your application.
2. Add any required API keys locally.
3. Never commit real API keys, passwords, or other secrets.

## How It Works

1. **Form upload:** Upload an image or PDF.
2. **Form understanding:** Get explanations of field labels and instructions.
3. **Supporting documents:** Provide relevant documents when needed.
4. **Extraction and mapping:** Map available information to form fields.
5. **Verification and review:** Confirm or correct extracted values.
6. **Final draft:** Review unresolved fields before printing or using the draft.

## Privacy and Security

- Use fictional data for demonstrations.
- Never commit real identity documents or personal KYC information.
- Never publish API keys or passwords.
- Review extracted information for accuracy before use.
- Treat generated forms as drafts until verified.
- AasaanForm AI is not an official government service.

## Documentation

See the `docs/` directory for available project architecture, AI-model, privacy, testing, and hackathon documentation.

## Hackathon

Developed for Poona College CodeCraft 2026, AasaanForm AI aims to make form understanding and assisted form completion more accessible.

See `docs/HACKATHON_REQUIREMENTS.md` for the documented project requirements.

## Contributing

Contributions are welcome. See `CONTRIBUTING.md` for contribution guidelines.

## License

See the `LICENSE` file for the applicable license.

---

**AasaanForm AI — Making forms easier to understand, one field at a time.**
