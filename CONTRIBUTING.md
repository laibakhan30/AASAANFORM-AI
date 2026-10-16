# Contributing to PatraPilot AI

Thank you for your interest in contributing to PatraPilot AI! We welcome contributions from the community to help improve this project.

## How to Contribute

### Reporting Issues
If you find a bug or have a suggestion for improvement, please open an issue on GitHub. When reporting an issue, please include:
- A clear and descriptive title
- Steps to reproduce the issue (if applicable)
- Expected behavior vs. actual behavior
- Screenshots or screen recordings (if helpful)
- Your environment (OS, browser, version numbers)

### Suggesting Features
We welcome feature requests! Please open an issue with:
- **Feature Request** in the title
- A clear description of the feature and its purpose
- How it would improve the project
- Any potential implementation considerations

### Submitting Changes
We accept contributions via pull requests. Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or fix: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Ensure your code follows the project's coding standards
5. Add or update tests as needed
6. Commit your changes: `git commit -m "Description of changes"`
7. Push to your branch: `git push origin feature/your-feature-name`
8. Open a pull request against the `main` branch

## Development Setup

To set up the development environment:

1. Install Node.js 18+ and npm
2. Clone the repository
3. Install dependencies: `npm install`
4. Create a `.env.local` file based on `.env.example` if you want to test live AI features
5. Run the development server: `npm run dev`

## Coding Standards

We follow these guidelines to maintain code quality:

### TypeScript
- Use TypeScript for all new code
- Follow the existing code style in the repository
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript props interfaces
- Follow the existing naming conventions

### Styling
- Use Tailwind CSS for styling
- Follow the existing color scheme and spacing conventions
- Use utility classes rather than custom CSS when possible
- Ensure responsive design considerations

### AI Integration
- Keep AI provider code in `src/lib/ai/`
- Abstract provider-specific code behind a common interface
- Handle errors gracefully
- Do not hardcode API keys or secrets

### Documentation
- Update documentation when adding or changing features
- Keep README.md and other docs up to date
- Comment complex logic in the code

## Pull Request Process

1. Ensure your PR description clearly describes the changes
2. Link to any related issues
3. Make sure your code passes any existing tests
4. Be open to feedback and willing to make changes
5. Once approved, a maintainer will merge your PR

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms. Please see `CODE_OF_CONDUCT.md` for details.

## Licensing

By contributing to PatraPilot AI, you agree that your contributions will be licensed under the Apache License 2.0, the same license used by the project.

Thank you for contributing to PatraPilot AI!

Last updated: October 2026