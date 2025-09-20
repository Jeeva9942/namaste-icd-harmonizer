import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Code, BookOpen } from "lucide-react";
import namcCodes from "@/data/namc_codes.json";
import { generateICD11Mapping } from "@/utils/csvProcessor";

interface SearchResult {
  namaste_code: string;
  namaste_term: string;
  icd11_tm2_code: string;
  icd11_tm2_term: string;
  icd11_bio_code: string;
  icd11_bio_term: string;
  confidence_score: number;
}

export const NamasteCodeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      // Simulate search delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const results: SearchResult[] = [];
      const searchLower = searchTerm.toLowerCase();

      // Search through NAMC codes
      namcCodes.forEach((entry) => {
        const code = entry.NAMC_CODE;
        const term = entry.NAMC_term;
        
        if (
          code.toLowerCase().includes(searchLower) || 
          term.toLowerCase().includes(searchLower)
        ) {
          const icd11Mapping = generateICD11Mapping(code);
          results.push({
            namaste_code: code,
            namaste_term: term,
            icd11_tm2_code: icd11Mapping.tm2_code,
            icd11_tm2_term: icd11Mapping.tm2_term,
            icd11_bio_code: icd11Mapping.bio_code,
            icd11_bio_term: icd11Mapping.bio_term,
            confidence_score: icd11Mapping.confidence
          });
        }
      });

      // Limit results and sort by relevance
      const limitedResults = results
        .sort((a, b) => {
          // Exact code matches first
          const aExactCode = a.namaste_code.toLowerCase() === searchLower;
          const bExactCode = b.namaste_code.toLowerCase() === searchLower;
          if (aExactCode && !bExactCode) return -1;
          if (!aExactCode && bExactCode) return 1;
          
          // Then by confidence score
          return b.confidence_score - a.confidence_score;
        })
        .slice(0, 10);

      setSearchResults(limitedResults);
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(performSearch, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            NAMASTE Code Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NAMASTE codes or terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchTerm && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {isSearching ? "Searching..." : `Found ${searchResults.length} results`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          {searchResults.map((result, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid gap-4">
                  {/* NAMASTE Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">NAMASTE Code</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant="outline" className="font-mono">
                        {result.namaste_code}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.namaste_term}
                      </p>
                    </div>
                  </div>

                  {/* ICD-11 TM2 Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-600">ICD-11 TM2</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant="secondary" className="font-mono bg-blue-100 text-blue-800">
                        {result.icd11_tm2_code}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.icd11_tm2_term}
                      </p>
                    </div>
                  </div>

                  {/* ICD-11 Biomedicine Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">ICD-11 Biomedicine</span>
                    </div>
                    <div className="pl-6">
                      <Badge variant="secondary" className="font-mono bg-green-100 text-green-800">
                        {result.icd11_bio_code}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.icd11_bio_term}
                      </p>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Mapping Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(result.confidence_score)}`}></div>
                      <span className="text-sm font-mono">
                        {Math.round(result.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchTerm && !isSearching && searchResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              No NAMASTE codes match your search. Try different keywords or check the spelling.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};