"use client"

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploadMinimalProps {
  onUpload: (title: string, extractedData: any) => Promise<void>;
  uploading: boolean;
}

export function ResumeUploadMinimal({ onUpload, uploading }: ResumeUploadMinimalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleParseAndUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Please provide a title and select a PDF file.');
      return;
    }
    setParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: fullText }),
      });
      if (!response.ok) throw new Error('Failed to parse resume');
      const { parsedData } = await response.json();
      const cleanJson = parsedData.replace(/^```json\n/, '').replace(/\n```$/, '');
      const resumeData = JSON.parse(cleanJson);
      await onUpload(title, resumeData);
      toast.success('Resume uploaded successfully!');
      setFile(null);
      setTitle('');
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setParsing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Resume Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={parsing || uploading}
      />
      <div {...getRootProps()} className={`border-2 border-dashed p-4 rounded flex items-center justify-center cursor-pointer ${isDragActive ? 'bg-muted' : ''}`}
        style={{ minHeight: 120 }}>
        <input {...getInputProps()} />
        {file ? (
          <span>{file.name}</span>
        ) : isDragActive ? (
          <span>Drop the PDF here ...</span>
        ) : (
          <span className="flex items-center gap-2"><Upload /> Drag & drop or click to select PDF</span>
        )}
      </div>
      <Button onClick={handleParseAndUpload} disabled={parsing || uploading} className="w-full">
        {parsing || uploading ? 'Uploading...' : 'Upload Resume'}
      </Button>
    </div>
  );
}
