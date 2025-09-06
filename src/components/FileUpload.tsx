import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { parseCSV } from "@/utils/csvProcessor";

interface FileUploadProps {
  onFileProcessed: (data: any[]) => void;
  isProcessing: boolean;
  uploadProgress: number;
}

export const FileUpload = ({ onFileProcessed, isProcessing, uploadProgress }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const processFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      const parsedData = parseCSV(csvContent);
      onFileProcessed(parsedData);
    };
    reader.readAsText(file);
  }, [onFileProcessed]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
      setUploadStatus('success');
      processFile(file);
    } else {
      setUploadStatus('error');
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Upload NAMASTE CSV File</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : uploadStatus === 'success'
              ? 'border-success bg-success/5'
              : uploadStatus === 'error'
              ? 'border-destructive bg-destructive/5'
              : 'border-border hover:border-primary'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploadedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                {uploadStatus === 'success' ? (
                  <CheckCircle className="h-8 w-8 text-success" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-destructive" />
                )}
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
                <Badge variant={uploadStatus === 'success' ? 'default' : 'destructive'} className="mt-2">
                  {uploadStatus === 'success' ? 'Ready for Processing' : 'Invalid File Type'}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop the CSV file here' : 'Drag & drop NAMASTE CSV file'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to select file (CSV format only)
                </p>
              </div>
            </div>
          )}
        </div>

        {isProcessing && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing NAMASTE codes...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {uploadedFile && uploadStatus === 'success' && !isProcessing && (
          <div className="mt-6">
            <div className="text-center text-sm text-success font-medium">
              ✓ File processed successfully! Check the results below.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};