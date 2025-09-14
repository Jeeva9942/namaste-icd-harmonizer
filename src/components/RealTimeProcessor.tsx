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
      setCurrentStep("Initializing processor...");
      
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentStep("Parsing CSV file...");
      setProgress(5);

      // Parse CSV with better error handling
      const namasteData: NameasteRow[] = parseCSV(csvContent);
      console.log(`Processing ${namasteData.length} records`);
      
      setTotalCount(namasteData.length);
      setProgress(15);

      if (namasteData.length === 0) {
        throw new Error("No valid data found in CSV file. Please check the format and ensure it has at least two columns (code, term).");
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
      
      // Process codes in smaller batches for smoother real-time updates
      const batchSize = Math.max(1, Math.min(5, Math.ceil(namasteData.length / 20)));
      const allProcessedCodes: ProcessedCode[] = [];
      
      for (let i = 0; i < namasteData.length; i += batchSize) {
        const batch = namasteData.slice(i, i + batchSize);
        const processedBatch = processCodeMappings(batch);
        allProcessedCodes.push(...processedBatch);
        
        setProcessedCount(allProcessedCodes.length);
        const processingProgress = (allProcessedCodes.length / namasteData.length) * 65;
        setProgress(20 + processingProgress);
        
        // Update step with more detail
        setCurrentStep(`Processing NAMASTE codes... (${allProcessedCodes.length}/${namasteData.length})`);
        
        // Shorter delay for smoother progress
        await new Promise(resolve => setTimeout(resolve, 50));
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
    <Card className="w-full border-border/50 shadow-lg bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3">
          <div className="relative">
            {isComplete ? (
              <CheckCircle className="h-6 w-6 text-success animate-in zoom-in-75 duration-500" />
            ) : hasError ? (
              <AlertCircle className="h-6 w-6 text-destructive animate-pulse" />
            ) : (
              <div className="relative">
                <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                <div className="absolute inset-0 h-6 w-6 bg-primary/20 rounded-full animate-ping" />
              </div>
            )}
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Real-Time CSV Processing
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">{currentStep}</span>
            <span className="text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="w-full h-3 bg-muted" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-full opacity-50" />
          </div>
        </div>

        {totalCount > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
            <span className="text-sm font-medium text-muted-foreground">Processing codes:</span>
            <Badge 
              variant={isComplete ? "default" : "secondary"} 
              className={`transition-all duration-300 ${
                isComplete ? 'bg-success text-success-foreground animate-pulse' : 
                'bg-primary/10 text-primary border border-primary/20'
              }`}
            >
              {processedCount} / {totalCount}
            </Badge>
          </div>
        )}

        {isComplete && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg animate-in fade-in-50 duration-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="text-sm font-medium text-success-foreground">
                Successfully processed {processedCount} NAMASTE codes with ICD-11 mappings
              </p>
            </div>
          </div>
        )}

        {hasError && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-50 duration-500">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-medium text-destructive-foreground">
                  Processing failed
                </p>
                <p className="text-xs text-destructive-foreground/80 mt-1">
                  Please ensure your CSV has proper format with code and term columns
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};