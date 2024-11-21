import pdf from 'pdf-parse';

export async function getPdfContentFromBuffer(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}
