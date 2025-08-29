import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Download, ExternalLink, ArrowRight } from "lucide-react";

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

interface CodeMappingTableProps {
  mappings: CodeMapping[];
  isLoading: boolean;
  onExportFHIR: () => void;
}

export const CodeMappingTable = ({ mappings, isLoading, onExportFHIR }: CodeMappingTableProps) => {
  const mappedCount = mappings.filter(m => m.status === 'mapped').length;
  const partialCount = mappings.filter(m => m.status === 'partial').length;
  const unmappedCount = mappings.filter(m => m.status === 'unmapped').length;

  const getStatusBadge = (status: CodeMapping['status']) => {
    switch (status) {
      case 'mapped':
        return <Badge className="bg-success text-success-foreground">Fully Mapped</Badge>;
      case 'partial':
        return <Badge className="bg-warning text-warning-foreground">Partial</Badge>;
      case 'unmapped':
        return <Badge variant="destructive">Unmapped</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-destructive';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Mapping NAMASTE codes to ICD-11...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Code Mapping Results</CardTitle>
          <Button onClick={onExportFHIR} className="bg-primary hover:bg-primary-hover">
            <Download className="h-4 w-4 mr-2" />
            Export FHIR Bundle
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <p className="text-2xl font-bold text-success">{mappedCount}</p>
            <p className="text-sm text-muted-foreground">Fully Mapped</p>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <p className="text-2xl font-bold text-warning">{partialCount}</p>
            <p className="text-sm text-muted-foreground">Partial Mapping</p>
          </div>
          <div className="text-center p-3 bg-destructive/10 rounded-lg">
            <p className="text-2xl font-bold text-destructive">{unmappedCount}</p>
            <p className="text-sm text-muted-foreground">Unmapped</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAMASTE Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>ICD-11 TM2</TableHead>
                <TableHead>ICD-11 Biomedicine</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-mono">{mapping.namasteCode}</TableCell>
                  <TableCell>{mapping.namasteDescription}</TableCell>
                  <TableCell>
                    {mapping.icd11TM2Code ? (
                      <div>
                        <p className="font-mono text-sm">{mapping.icd11TM2Code}</p>
                        <p className="text-xs text-muted-foreground">{mapping.icd11TM2Description}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {mapping.icd11BioCode ? (
                      <div>
                        <p className="font-mono text-sm">{mapping.icd11BioCode}</p>
                        <p className="text-xs text-muted-foreground">{mapping.icd11BioDescription}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getConfidenceColor(mapping.mappingConfidence)}`}>
                      {mapping.mappingConfidence}%
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(mapping.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};