import { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { CodeMappingTable } from "./CodeMappingTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  FileText, 
  Activity, 
  TrendingUp, 
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { parseCSV, processCodeMappings, generateFHIRBundle, NameasteRow, ProcessedCode } from "@/utils/csvProcessor";
import { useToast } from "@/hooks/use-toast";

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedData, setProcessedData] = useState<ProcessedCode[]>([]);
  const [fhirBundle, setFhirBundle] = useState<any>(null);
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalCodes: 0,
    mappedCodes: 0,
    unmappedCodes: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user's uploaded files
      const { data: files, error: filesError } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (filesError) throw filesError;
      setUserFiles(files || []);

      // Fetch user's processed codes for stats
      const { data: codes, error: codesError } = await supabase
        .from('processed_codes')
        .select('*')
        .eq('user_id', user.id);

      if (codesError) throw codesError;

      // Calculate stats
      const totalCodes = codes?.length || 0;
      const mappedCodes = codes?.filter(c => c.mapping_status === 'mapped').length || 0;
      const partialCodes = codes?.filter(c => c.mapping_status === 'partial').length || 0;
      const unmappedCodes = codes?.filter(c => c.mapping_status === 'unmapped').length || 0;

      setStats({
        totalFiles: files?.length || 0,
        totalCodes,
        mappedCodes: mappedCodes + partialCodes,
        unmappedCodes
      });

      // Load latest processed data if any
      if (codes && codes.length > 0) {
        const latestCodes = codes.slice(0, 50); // Show latest 50 codes
        const formattedCodes: ProcessedCode[] = latestCodes.map(code => ({
          namaste_code: code.namaste_code,
          namaste_term: code.namaste_term,
          icd11_tm2_code: code.icd11_tm2_code || '',
          icd11_tm2_term: code.icd11_tm2_term || '',
          icd11_bio_code: code.icd11_bio_code || '',
          icd11_bio_term: code.icd11_bio_term || '',
          confidence_score: code.confidence_score || 0.5,
          mapping_status: (code.mapping_status || 'unmapped') as 'mapped' | 'partial' | 'unmapped'
        }));
        setProcessedData(formattedCodes);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your data"
      });
    }
  };

  const handleFileProcessed = async (namasteData: NameasteRow[]) => {
    if (!user || !namasteData.length) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Create file record
      const { data: fileRecord, error: fileError } = await supabase
        .from('uploaded_files')
        .insert({
          user_id: user.id,
          filename: `namaste_upload_${Date.now()}.csv`,
          file_size: namasteData.length * 100, // Estimate
          total_records: namasteData.length,
          processing_status: 'processing'
        })
        .select()
        .single();

      if (fileError) throw fileError;

      // Process the mappings
      const processedCodes = processCodeMappings(namasteData);
      setProcessedData(processedCodes);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Store processed codes
      const codesToInsert = processedCodes.map(code => ({
        file_id: fileRecord.id,
        user_id: user.id,
        namaste_code: code.namaste_code,
        namaste_term: code.namaste_term,
        icd11_tm2_code: code.icd11_tm2_code,
        icd11_tm2_term: code.icd11_tm2_term,
        icd11_bio_code: code.icd11_bio_code,
        icd11_bio_term: code.icd11_bio_term,
        confidence_score: code.confidence_score,
        mapping_status: code.mapping_status
      }));

      const { error: codesError } = await supabase
        .from('processed_codes')
        .insert(codesToInsert);

      if (codesError) throw codesError;

      // Update file status
      await supabase
        .from('uploaded_files')
        .update({ 
          processing_status: 'completed',
          processed_records: processedCodes.length 
        })
        .eq('id', fileRecord.id);

      // Generate FHIR bundle
      const bundle = generateFHIRBundle(processedCodes, user.email || '');
      setFhirBundle(bundle);

      // Refresh user data
      await fetchUserData();

      toast({
        title: "Success",
        description: `Processed ${processedCodes.length} NAMASTE codes successfully!`
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the CSV file"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadFHIR = () => {
    if (fhirBundle) {
      const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `namaste-icd11-mapping-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalFiles}</p>
                <p className="text-sm text-muted-foreground">Files Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalCodes}</p>
                <p className="text-sm text-muted-foreground">Total Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{stats.mappedCodes}</p>
                <p className="text-sm text-muted-foreground">Mapped Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{stats.unmappedCodes}</p>
                <p className="text-sm text-muted-foreground">Unmapped Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload & Process</TabsTrigger>
          <TabsTrigger value="results">Mapping Results</TabsTrigger>
          <TabsTrigger value="export">FHIR Export</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <FileUpload 
            onFileProcessed={handleFileProcessed}
            isProcessing={isProcessing}
            uploadProgress={uploadProgress}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {processedData.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Code Mapping Results</h3>
                <Badge variant="secondary">
                  {processedData.length} codes processed
                </Badge>
              </div>
              <CodeMappingTable 
                mappings={processedData.map((item, index) => ({
                  id: String(index + 1),
                  namasteCode: item.namaste_code,
                  namasteDescription: item.namaste_term,
                  icd11TM2Code: item.icd11_tm2_code,
                  icd11TM2Description: item.icd11_tm2_term,
                  icd11BioCode: item.icd11_bio_code,
                  icd11BioDescription: item.icd11_bio_term,
                  mappingConfidence: Math.round(item.confidence_score * 100),
                  status: item.mapping_status
                }))}
                isLoading={isProcessing}
                onExportFHIR={handleDownloadFHIR}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  Upload a NAMASTE CSV file to see the mapping results here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-primary" />
                <span>FHIR R4 Bundle Export</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fhirBundle ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">NAMASTE-ICD11 Mapping Bundle</h4>
                      <p className="text-sm text-muted-foreground">
                        FHIR R4 compliant CodeSystem with {processedData.length} concepts
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Badge variant="outline">ISO 22600 Compliant</Badge>
                        <Badge variant="outline">FHIR R4</Badge>
                        <Badge variant="outline">Audit Ready</Badge>
                      </div>
                    </div>
                    <Button onClick={handleDownloadFHIR}>
                      <Download className="h-4 w-4 mr-2" />
                      Download JSON
                    </Button>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Bundle Preview</h5>
                    <pre className="text-xs overflow-auto max-h-48">
                      {JSON.stringify(fhirBundle, null, 2).substring(0, 500)}...
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Download className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Export Available</h3>
                  <p className="text-muted-foreground">
                    Process a NAMASTE CSV file first to generate the FHIR bundle for export.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};