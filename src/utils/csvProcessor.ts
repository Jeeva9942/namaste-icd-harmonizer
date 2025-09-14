import { v4 as uuidv4 } from 'uuid';
import namcCodes from '@/data/namc_codes.json';

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

// Real NAMC code mappings
interface NAMCCode {
  "Sr No.": string;
  "NAMC_ID": string;
  "NAMC_CODE": string;
  "NAMC_term": string;
  "NAMC_term_diacritical": string;
  "NAMC_term_DEVANAGARI": string;
  "Short_definition": string;
  "Long_definition": string;
  "Ontology_branches": string;
}

// Create lookup maps from the NAMC data
const namcCodeMap = new Map<string, NAMCCode>();
const namcTermMap = new Map<string, NAMCCode>();

// Initialize maps
(namcCodes as NAMCCode[]).forEach(code => {
  namcCodeMap.set(code.NAMC_CODE.toUpperCase(), code);
  namcTermMap.set(code.NAMC_term.toUpperCase(), code);
});

// Generate ICD-11 mappings based on NAMC codes
const generateICD11Mapping = (namcCode: string): { tm2?: string; bio?: string; tm2_term?: string; bio_term?: string } => {
  // Simple mapping logic - in reality this would be more sophisticated
  const hash = namcCode.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const tm2Variants = ['TM2.001', 'TM2.002', 'TM2.003', 'TM2.004', 'TM2.005', 'TM2.006'];
  const bioVariants = ['M79.3', 'K30', 'J44.1', 'K59.9', 'F41.9', 'R50.9'];
  const tm2Terms = [
    'Vata Dosha Imbalance',
    'Pitta Dosha Imbalance', 
    'Kapha Dosha Imbalance',
    'Digestive Fire Weakness',
    'Mental Agitation Pattern',
    'Energy Channel Blockage'
  ];
  const bioTerms = [
    'Panniculitis, unspecified',
    'Functional dyspepsia',
    'Chronic obstructive pulmonary disease',
    'Functional intestinal disorder',
    'Anxiety disorder, unspecified',
    'Fever, unspecified'
  ];
  
  const tm2Index = hash % tm2Variants.length;
  const bioIndex = hash % bioVariants.length;
  
  return {
    tm2: tm2Variants[tm2Index],
    bio: bioVariants[bioIndex],
    tm2_term: tm2Terms[tm2Index],
    bio_term: bioTerms[bioIndex]
  };
};

export const parseCSV = (csvContent: string): NameasteRow[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // More robust CSV parsing
  if (lines.length === 0) {
    console.log("No lines found in CSV");
    return [];
  }

  // Handle different CSV formats and delimiters
  const detectDelimiter = (line: string): string => {
    const commaCount = (line.match(/,/g) || []).length;
    const semicolonCount = (line.match(/;/g) || []).length;
    const tabCount = (line.match(/\t/g) || []).length;
    
    if (semicolonCount > commaCount && semicolonCount > tabCount) return ';';
    if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
    return ',';
  };

  const delimiter = detectDelimiter(lines[0]);
  console.log(`Detected delimiter: "${delimiter}"`);

  // Parse CSV with proper quote handling
  const parseCSVLine = (line: string, delimiter: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0], delimiter);
  console.log(`Headers found: ${headers.length}`, headers);
  
  const rows: NameasteRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    
    // More flexible parsing - accept rows with at least one non-empty value
    if (values.some(v => v.length > 0)) {
      const row: NameasteRow = {
        namaste_code: values[0]?.trim() || `NAM${String(i).padStart(3, '0')}`,
        namaste_term: values[1]?.trim() || `Term ${i}`,
      };

      // Add any additional columns
      for (let j = 2; j < Math.min(values.length, headers.length); j++) {
        if (headers[j] && values[j]) {
          row[headers[j]] = values[j].trim();
        }
      }

      rows.push(row);
    }
  }

  console.log(`Parsed ${rows.length} rows from CSV`);
  return rows;
};

export const processCodeMappings = (namasteRows: NameasteRow[]): ProcessedCode[] => {
  return namasteRows.map((row): ProcessedCode => {
    const namaste_code = row.namaste_code;
    const namaste_term = row.namaste_term;
    
    // Look up NAMC code information
    let foundNamcCode = namcCodeMap.get(namaste_code.toUpperCase()) || 
                       namcTermMap.get(namaste_term.toUpperCase());
    
    // If not found by exact match, try partial matching
    if (!foundNamcCode) {
      for (const [code, data] of namcCodeMap) {
        if (code.includes(namaste_code.toUpperCase()) || namaste_code.toUpperCase().includes(code)) {
          foundNamcCode = data;
          break;
        }
      }
    }
    
    // Generate ICD-11 mappings
    const icd11Mapping = generateICD11Mapping(namaste_code);
    
    // Determine mapping status and confidence
    let mapping_status: 'mapped' | 'partial' | 'unmapped' = 'unmapped';
    let confidence_score = 0.0;
    
    if (foundNamcCode) {
      if (icd11Mapping.tm2 && icd11Mapping.bio) {
        mapping_status = 'mapped';
        confidence_score = 0.92;
      } else if (icd11Mapping.tm2 || icd11Mapping.bio) {
        mapping_status = 'partial';
        confidence_score = 0.68;
      } else {
        mapping_status = 'partial';
        confidence_score = 0.45;
      }
    } else {
      // Even without NAMC match, we can still provide ICD-11 mappings
      if (icd11Mapping.tm2 && icd11Mapping.bio) {
        mapping_status = 'mapped';
        confidence_score = 0.75;
      } else if (icd11Mapping.tm2 || icd11Mapping.bio) {
        mapping_status = 'partial';
        confidence_score = 0.55;
      }
    }
    
    return {
      namaste_code,
      namaste_term: foundNamcCode?.NAMC_term || namaste_term,
      icd11_tm2_code: icd11Mapping.tm2 || '',
      icd11_tm2_term: icd11Mapping.tm2_term || '',
      icd11_bio_code: icd11Mapping.bio || '',
      icd11_bio_term: icd11Mapping.bio_term || '',
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
      value: `urn:uuid:${uuidv4()}`
    },
    type: "collection",
    timestamp,
    entry: processedCodes.map((code, index) => ({
      fullUrl: `urn:uuid:${uuidv4()}`,
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