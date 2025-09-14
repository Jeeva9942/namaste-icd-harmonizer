import { useState, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { parseCSV, processCodeMappings, NameasteRow, ProcessedCode } from "@/utils/csvProcessor";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface RealTimeProcessorProps {
  csvContent: string;
  filename: string;
  onProcessingComplete: (data: ProcessedCode[]) => void;
}

export const RealTimeProcessor = ({ csvContent, filename, onProcessingComplete }: RealTimeProcessorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  const processInRealTime = useCallback(async () => {
    if (!user || !csvContent) return;

    try {
      setHasError(false);
      setProgress(0);
      setCurrentStep("Parsing CSV file...");

      // Parse CSV
      const namasteData: NameasteRow[] = parseCSV(csvContent);
      setTotalCount(namasteData.length);
      setProgress(10);

      if (namasteData.length === 0) {
        throw new Error("No valid data found in CSV file");
      }

      setCurrentStep("Creating file record...");
      
      // Create file record
      const { data: fileRecord, error: fileError } = await supabase
        .from('uploaded_files')
        .insert({
          user_id: user.id,
          filename,
          file_size: csvContent.length,
          total_records: namasteData.length,
          processing_status: 'processing'
        })
        .select()
        .single();

      if (fileError) throw fileError;
      setProgress(20);

      setCurrentStep("Processing NAMASTE codes...");
      
      // Process codes in batches for real-time updates
      const batchSize = 10;
      const allProcessedCodes: ProcessedCode[] = [];
      
      for (let i = 0; i < namasteData.length; i += batchSize) {
        const batch = namasteData.slice(i, i + batchSize);
        const processedBatch = processCodeMappings(batch);
        allProcessedCodes.push(...processedBatch);
        
        setProcessedCount(allProcessedCodes.length);
        setProgress(20 + (allProcessedCodes.length / namasteData.length) * 60);
        
        // Small delay to show real-time progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setCurrentStep("Saving to database...");
      
      // Store processed codes in batches
      const codesToInsert = allProcessedCodes.map(code => ({
        file_id: fileRecord.id,
        user_id: user.id,
        namaste_code: code.namaste_code,
        namaste_term: code.namaste_term,
        icd11_tm2_code: code.icd11_tm2_code || null,
        icd11_tm2_term: code.icd11_tm2_term || null,
        icd11_bio_code: code.icd11_bio_code || null,
        icd11_bio_term: code.icd11_bio_term || null,
        confidence_score: code.confidence_score,
        mapping_status: code.mapping_status
      }));

      // Insert in batches to avoid timeout
      const insertBatchSize = 50;
      for (let i = 0; i < codesToInsert.length; i += insertBatchSize) {
        const batch = codesToInsert.slice(i, i + insertBatchSize);
        const { error: codesError } = await supabase
          .from('processed_codes')
          .insert(batch);

        if (codesError) throw codesError;
        
        setProgress(80 + ((i + batch.length) / codesToInsert.length) * 15);
      }

      setCurrentStep("Finalizing...");
      
      // Update file status
      await supabase
        .from('uploaded_files')
        .update({ 
          processing_status: 'completed',
          processed_records: allProcessedCodes.length 
        })
        .eq('id', fileRecord.id);

      setProgress(100);
      setCurrentStep("Complete!");
      setIsComplete(true);

      toast({
        title: "Success",
        description: `Successfully processed ${allProcessedCodes.length} NAMASTE codes with real-time conversion!`
      });

      onProcessingComplete(allProcessedCodes);

    } catch (error) {
      console.error('Real-time processing error:', error);
      setHasError(true);
      setCurrentStep("Error occurred");
      
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Failed to process CSV file"
      });
    }
  }, [csvContent, filename, user, onProcessingComplete, toast]);

  // Auto-start processing when component mounts
  useEffect(() => {
    if (csvContent && !isComplete && !hasError) {
      processInRealTime();
    }
  }, [csvContent, isComplete, hasError, processInRealTime]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : hasError ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
          )}
          <span>Real-Time CSV Processing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{currentStep}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {totalCount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span>Processing codes:</span>
            <Badge variant={isComplete ? "default" : "secondary"}>
              {processedCount} / {totalCount}
            </Badge>
          </div>
        )}

        {isComplete && (
          <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success-foreground">
              ✓ Successfully processed {processedCount} NAMASTE codes with ICD-11 mappings
            </p>
          </div>
        )}

        {hasError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive-foreground">
              ✗ Processing failed. Please check your CSV format and try again.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};