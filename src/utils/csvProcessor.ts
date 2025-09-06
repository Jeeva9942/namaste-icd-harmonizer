export interface NameasteRow {
  namaste_code: string;
  namaste_term: string;
  [key: string]: string; // Allow additional CSV columns
}

export interface ProcessedCode {
  namaste_code: string;
  namaste_term: string;
  icd11_tm2_code: string;
  icd11_tm2_term: string;
  icd11_bio_code: string;
  icd11_bio_term: string;
  confidence_score: number;
  mapping_status: 'mapped' | 'partial' | 'unmapped';
}

// Mock ICD-11 mapping data - in real implementation, this would come from WHO ICD-11 API
const mockTM2Mappings: Record<string, { code: string; term: string }> = {
  "NAM001": { code: "TM2.001", term: "Vata Dosha Imbalance" },
  "NAM002": { code: "TM2.002", term: "Pitta Dosha Imbalance" },
  "NAM003": { code: "TM2.003", term: "Kapha Dosha Imbalance" },
  "NAM004": { code: "TM2.004", term: "Digestive Fire Weakness" },
  "NAM005": { code: "TM2.005", term: "Mental Agitation Pattern" }
};

const mockBioMappings: Record<string, { code: string; term: string }> = {
  "NAM001": { code: "M79.3", term: "Panniculitis, unspecified" },
  "NAM002": { code: "K30", term: "Functional dyspepsia" },
  "NAM003": { code: "J44.1", term: "Chronic obstructive pulmonary disease with acute exacerbation" },
  "NAM004": { code: "K59.9", term: "Functional intestinal disorder, unspecified" },
  "NAM005": { code: "F41.9", term: "Anxiety disorder, unspecified" }
};

export const parseCSV = (csvContent: string): NameasteRow[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows: NameasteRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length >= 2) {
      const row: NameasteRow = {
        namaste_code: values[0] || `NAM${String(i).padStart(3, '0')}`,
        namaste_term: values[1] || `Term ${i}`,
      };

      // Add any additional columns
      for (let j = 2; j < Math.min(values.length, headers.length); j++) {
        row[headers[j]] = values[j];
      }

      rows.push(row);
    }
  }

  return rows;
};

export const processCodeMappings = (namasteRows: NameasteRow[]): ProcessedCode[] => {
  return namasteRows.map((row): ProcessedCode => {
    const tm2Mapping = mockTM2Mappings[row.namaste_code];
    const bioMapping = mockBioMappings[row.namaste_code];

    let mapping_status: 'mapped' | 'partial' | 'unmapped' = 'unmapped';
    let confidence_score = 0.5;

    if (tm2Mapping && bioMapping) {
      mapping_status = 'mapped';
      confidence_score = 0.95;
    } else if (tm2Mapping || bioMapping) {
      mapping_status = 'partial';
      confidence_score = 0.75;
    }

    return {
      namaste_code: row.namaste_code,
      namaste_term: row.namaste_term,
      icd11_tm2_code: tm2Mapping?.code || '',
      icd11_tm2_term: tm2Mapping?.term || '',
      icd11_bio_code: bioMapping?.code || '',
      icd11_bio_term: bioMapping?.term || '',
      confidence_score,
      mapping_status
    };
  });
};

export const generateFHIRBundle = (processedCodes: ProcessedCode[], userEmail: string) => {
  const timestamp = new Date().toISOString();
  
  return {
    resourceType: "Bundle",
    id: `namaste-icd11-mapping-${Date.now()}`,
    meta: {
      lastUpdated: timestamp,
      profile: ["http://hl7.org/fhir/StructureDefinition/Bundle"]
    },
    identifier: {
      system: "urn:ietf:rfc:3986",
      value: `urn:uuid:${crypto.randomUUID()}`
    },
    type: "collection",
    timestamp,
    entry: processedCodes.map((code, index) => ({
      fullUrl: `urn:uuid:${crypto.randomUUID()}`,
      resource: {
        resourceType: "CodeSystem",
        id: `namaste-${code.namaste_code}`,
        meta: {
          versionId: "1",
          lastUpdated: timestamp,
          profile: ["http://hl7.org/fhir/StructureDefinition/CodeSystem"]
        },
        url: `http://namaste.gov.in/fhir/CodeSystem/namaste-terminology`,
        identifier: [
          {
            system: "urn:ietf:rfc:3986",
            value: `urn:oid:2.16.356.10.${Date.now()}.${index}`
          }
        ],
        version: "2024.1",
        name: "NAMASTETerminology",
        title: "NAMASTE Terminology System",
        status: "active",
        experimental: false,
        date: timestamp,
        publisher: "Ministry of Ayush, Government of India",
        contact: [
          {
            name: "NAMASTE System Administrator",
            telecom: [
              {
                system: "email",
                value: userEmail
              }
            ]
          }
        ],
        description: "NAMASTE codes with ICD-11 TM2 and Biomedicine mappings for traditional medicine integration",
        jurisdiction: [
          {
            coding: [
              {
                system: "urn:iso:std:iso:3166",
                code: "IN",
                display: "India"
              }
            ]
          }
        ],
        purpose: "To provide standardized terminology for Ayurveda, Siddha, and Unani medical systems with global ICD-11 interoperability",
        copyright: "© 2024 Ministry of Ayush, Government of India. All rights reserved.",
        caseSensitive: true,
        valueSet: "http://namaste.gov.in/fhir/ValueSet/all-namaste-codes",
        content: "complete",
        count: 1,
        concept: [
          {
            code: code.namaste_code,
            display: code.namaste_term,
            definition: `Traditional medicine term: ${code.namaste_term}`,
            designation: [
              ...(code.icd11_tm2_code ? [{
                language: "en-US",
                use: {
                  system: "http://terminology.hl7.org/CodeSystem/designation-usage",
                  code: "display"
                },
                value: `ICD-11 TM2: ${code.icd11_tm2_code} - ${code.icd11_tm2_term}`
              }] : []),
              ...(code.icd11_bio_code ? [{
                language: "en-US",
                use: {
                  system: "http://terminology.hl7.org/CodeSystem/designation-usage",
                  code: "display"
                },
                value: `ICD-11 Biomedicine: ${code.icd11_bio_code} - ${code.icd11_bio_term}`
              }] : [])
            ],
            property: [
              {
                code: "confidence_score",
                valueDecimal: code.confidence_score
              },
              {
                code: "mapping_status",
                valueCode: code.mapping_status
              },
              ...(code.icd11_tm2_code ? [{
                code: "icd11_tm2_mapping",
                valueString: `${code.icd11_tm2_code}|${code.icd11_tm2_term}`
              }] : []),
              ...(code.icd11_bio_code ? [{
                code: "icd11_bio_mapping",
                valueString: `${code.icd11_bio_code}|${code.icd11_bio_term}`
              }] : [])
            ]
          }
        ]
      }
    }))
  };
};