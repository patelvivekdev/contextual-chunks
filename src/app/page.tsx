'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ contextualChunks: string[] } | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const file = acceptedFiles[0];
      if (!file || file.type !== 'application/pdf') {
        throw new Error('Please upload a PDF file');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/generate-chunks`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process PDF');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Contextual Chunks Generator</CardTitle>
          <CardDescription>
            Upload a PDF to generate contextual chunks (Generate Only 10 chunks with free Google
            LLM)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:bg-gray-50',
              isDragActive && 'border-primary bg-gray-50',
              loading && 'pointer-events-none opacity-60',
            )}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? 'Drop the PDF here'
                : 'Drag and drop a PDF file here, or click to select'}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing PDF...
            </div>
          )}

          {error && <div className="text-sm text-red-500">{error}</div>}

          {result && (
            <div className="space-y-2">
              <h3 className="font-medium">Generated Chunks:</h3>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                {result.contextualChunks.map((chunk, i) => (
                  <div key={i} className="mb-4">
                    <div className="rounded-md bg-gray-50 p-3 text-sm">{chunk}</div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
