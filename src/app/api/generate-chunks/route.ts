import { createContextualPrompts, generateContextualChunks } from '@/lib/chunks';
import { getPdfContentFromBuffer } from '@/lib/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return Response.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Max file size is 4MB
    if (file.size > 4 * 1024 * 1024) {
      return Response.json({ error: 'File size must be less than 4MB' }, { status: 400 });
    }

    // Convert File to ArrayBuffer and then to text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfContent = await getPdfContentFromBuffer(buffer);

    // Generate text chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 30,
    });
    const textChunks = await textSplitter.createDocuments([pdfContent]);

    // Generate Contextual Prompts
    const contextualPrompts = await createContextualPrompts(
      pdfContent,
      textChunks.map((chunk) => chunk.pageContent),
    );
    // Generate Contextual Chunks with LLM
    const contextualChunks = await generateContextualChunks(contextualPrompts);

    return Response.json({
      success: true,
      filename: file.name,
      contextualChunks: contextualChunks,
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to process PDF',
      },
      { status: 500 },
    );
  }
}
