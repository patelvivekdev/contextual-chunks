# Contextual Chunks Generator

This project demonstrates how to generate contextual chunks for Retrieval-Augmented Generation (RAG) and other use cases using a PDF document. The application processes a PDF file, splits it into chunks, and generates contextual prompts to provide meaningful context for each chunk using a language model.

## Features

- Upload a PDF file to generate contextual chunks.
- Uses Google Generative AI API for generating contextual chunks.
- Displays generated chunks.
- Next.js for server-side rendering and API routes.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/patelvivekdev/contextual-chunks.git
   cd contextual-chunks
   ```

2. Install dependencies:

   ```bash
   bun i
   ```

3. Create a `.env` file based on `.env.example` and add your Google Generative AI API key:

   ```bash
   cp .env.example .env
   ```

4. Run the development server:

   ```bash
   bun run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Dependencies

- `@ai`: Vercel SDK for using AI services.
- `@ai-sdk/google`: SDK for Google Generative AI.
- `@langchain/textsplitters`: Library for splitting text into chunks.
- `pdf-parse`: Library for parsing PDF files.
- `react-dropzone`: Library for handling file uploads.

## License

This project is licensed under the MIT License.
