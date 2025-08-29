import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileUpload } from "./FileUpload";
import { CodeMappingTable } from "./CodeMappingTable";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, FileText, Zap } from "lucide-react";

interface CodeMapping {
  id: string;
  namasteCode: string;
  namasteDescription: string;
  icd11TM2Code?: string;
  icd11TM2Description?: string;
  icd11BioCode?: string;
  icd11BioDescription?: string;
  mappingConfidence: number;
  status: 'mapped' | 'partial' | 'unmapped';
}

export const Dashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mappings, setMappings] = useState<CodeMapping[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadProgress(0);
    setShowResults(false);

    // Simulate file processing with progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          // Simulate API call completion
          setTimeout(() => {
            setIsProcessing(false);
            setUploadProgress(100);
            generateMockMappings();
            setShowResults(true);
          }, 1000);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
  };

  const generateMockMappings = () => {
    const mockMappings: CodeMapping[] = [
      {
        id: '1',
        namasteCode: 'NAM001',
        namasteDescription: 'Vata Dosha Imbalance - Neurological manifestations',
        icd11TM2Code: 'TM21.A1',
        icd11TM2Description: 'Wind pattern disorder affecting nervous system',
        icd11BioCode: 'G93.1',
        icd11BioDescription: 'Other specified disorders of brain',
        mappingConfidence: 92,
        status: 'mapped'
      },
      {
        id: '2',
        namasteCode: 'NAM002',
        namasteDescription: 'Pitta Dosha Excess - Inflammatory conditions',
        icd11TM2Code: 'TM22.B2',
        icd11TM2Description: 'Heat pattern excess with inflammatory manifestation',
        icd11BioCode: 'M79.9',
        icd11BioDescription: 'Soft tissue disorder, unspecified',
        mappingConfidence: 88,
        status: 'mapped'
      },
      {
        id: '3',
        namasteCode: 'NAM003',
        namasteDescription: 'Kapha Dosha Stagnation - Respiratory congestion',
        icd11TM2Code: 'TM23.C1',
        icd11TM2Description: 'Phlegm pattern stagnation affecting respiratory system',
        mappingConfidence: 75,
        status: 'partial'
      },
      {
        id: '4',
        namasteCode: 'NAM004',
        namasteDescription: 'Agnimandya - Digestive fire weakness',
        icd11TM2Code: 'TM24.D1',
        icd11TM2Description: 'Digestive fire deficiency pattern',
        icd11BioCode: 'K59.9',
        icd11BioDescription: 'Functional intestinal disorder, unspecified',
        mappingConfidence: 94,
        status: 'mapped'
      },
      {
        id: '5',
        namasteCode: 'NAM005',
        namasteDescription: 'Siddha Thridosha Imbalance - Complex constitutional disorder',
        mappingConfidence: 45,
        status: 'unmapped'
      }
    ];
    setMappings(mockMappings);
  };

  const handleExportFHIR = () => {
    // Mock FHIR export
    const fhirBundle = {
      resourceType: "Bundle",
      id: "namaste-icd11-mapping",
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: mappings.map(mapping => ({
        resource: {
          resourceType: "ConceptMap",
          id: mapping.id,
          status: "active",
          sourceCanonical: "http://namaste.gov.in/ValueSet/disorders",
          targetCanonical: "http://who.int/icd11/ValueSet/TM2",
          group: [{
            source: "http://namaste.gov.in/CodeSystem/disorders",
            target: "http://who.int/icd11/CodeSystem/TM2",
            element: [{
              code: mapping.namasteCode,
              display: mapping.namasteDescription,
              target: mapping.icd11TM2Code ? [{
                code: mapping.icd11TM2Code,
                display: mapping.icd11TM2Description,
                equivalence: mapping.mappingConfidence > 80 ? "equivalent" : "wider"
              }] : []
            }]
          }]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'namaste-icd11-fhir-bundle.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4,500+</p>
                <p className="text-sm text-muted-foreground">NAMASTE Terms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-medical-teal/10 rounded-lg">
                <Database className="h-6 w-6 text-medical-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold">529</p>
                <p className="text-sm text-muted-foreground">ICD-11 TM2 Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-medical-green/10 rounded-lg">
                <Activity className="h-6 w-6 text-medical-green" />
              </div>
              <div>
                <p className="text-2xl font-bold">196</p>
                <p className="text-sm text-muted-foreground">Pattern Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">FHIR R4</p>
                <p className="text-sm text-muted-foreground">Compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FileUpload 
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            uploadProgress={uploadProgress}
          />

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">EHR Standards Compliance</span>
                <Badge className="bg-success text-success-foreground">2016 Standards</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Authentication</span>
                <Badge className="bg-primary text-primary-foreground">ABHA OAuth 2.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Security</span>
                <Badge className="bg-medical-teal text-white">ISO 22600</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Terminology Standards</span>
                <Badge variant="secondary">SNOMED CT / LOINC</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {showResults ? (
            <CodeMappingTable 
              mappings={mappings}
              isLoading={false}
              onExportFHIR={handleExportFHIR}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Upload a NAMASTE CSV file to begin code mapping</p>
                  <p className="text-sm mt-2">The system will automatically map to ICD-11 TM2 and Biomedicine codes</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};