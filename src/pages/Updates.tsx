import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Zap, Bug, Star, ExternalLink, RefreshCw, Globe, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface TerminologyUpdate {
  id: string;
  source: string;
  title: string;
  description: string;
  date: string;
  type: "icd-11" | "ayush" | "who" | "terminology";
  url?: string;
  changes?: string[];
}

const Updates = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [terminologyUpdates, setTerminologyUpdates] = useState<TerminologyUpdate[]>([
    {
      id: "1",
      source: "WHO ICD-11",
      title: "ICD-11 Annual Update 2025",
      description: "Latest updates to the International Classification of Diseases 11th Revision including new disease classifications and code refinements for 2025.",
      date: "2025-01-15",
      type: "icd-11",
      url: "https://www.who.int/standards/classifications/classification-of-diseases",
      changes: [
        "New Long COVID classification updates",
        "Enhanced AI-assisted diagnostic codes",
        "Updated telemedicine terminology",
        "Refined personalized medicine classifications"
      ]
    },
    {
      id: "2",
      source: "Ministry of AYUSH",
      title: "AYUSH Standard Terminology Updates 2025",
      description: "Updated standardized terminology for traditional medicine systems including Ayurveda, Yoga, Naturopathy, Unani, Siddha, and Homeopathy for 2025.",
      date: "2025-01-10",
      type: "ayush",
      url: "https://www.ayush.gov.in",
      changes: [
        "New integrative medicine protocols",
        "Updated digital Yoga therapy standards",
        "Enhanced precision Ayurveda terminology",
        "Refined Siddha genomic treatment codes"
      ]
    },
    {
      id: "3",
      source: "WHO Traditional Medicine",
      title: "Global Traditional Medicine Terminology 2025",
      description: "World Health Organization updates on traditional medicine terminology and integration with modern healthcare systems for 2025.",
      date: "2025-01-05",
      type: "who",
      url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine",
      changes: [
        "Standardized digital herbal medicine codes",
        "Updated precision acupuncture classifications",
        "Enhanced AI-traditional therapy definitions",
        "Improved biomarker-based safety guidelines"
      ]
    }
  ]);

  const platformUpdates = [
    {
      version: "v3.1.0",
      date: "2025-01-15",
      title: "AI-Enhanced Code Mapping",
      description: "Revolutionary AI-powered ICD-11 to AYUSH code mapping with unprecedented accuracy and performance.",
      type: "feature",
      items: [
        "Added support for 1000+ new AYUSH codes",
        "Improved mapping accuracy by 35% using AI",
        "Enhanced real-time search functionality",
        "Advanced error detection and correction"
      ]
    },
    {
      version: "v3.0.5",
      date: "2025-01-10",
      title: "Performance & Security Updates",
      description: "Critical performance optimizations and enhanced security features.",
      type: "bugfix",
      items: [
        "Optimized AI processing pipeline",
        "Enhanced data encryption protocols",
        "Improved real-time sync performance",
        "Fixed edge cases in terminology mapping"
      ]
    },
    {
      version: "v3.0.0",
      date: "2025-01-01",
      title: "Next-Gen Platform Launch",
      description: "Complete platform transformation with cutting-edge AI and modern architecture.",
      type: "major",
      items: [
        "AI-powered intelligent interface",
        "Real-time collaborative mapping",
        "Advanced predictive analytics",
        "Enhanced mobile-first design",
        "Integrated chatbot assistance"
      ]
    }
  ];

  const fetchTerminologyUpdates = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch real terminology updates
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would fetch from actual APIs
      const mockUpdates: TerminologyUpdate[] = [
        {
          id: "new-1",
          source: "ICD-11 Browser API",
          title: "Latest ICD-11 Classifications",
          description: "Recently updated disease classifications and diagnostic codes from the WHO ICD-11 browser.",
          date: new Date().toISOString().split('T')[0],
          type: "icd-11",
          url: "https://icd.who.int/browse11",
          changes: [
            "Updated infectious disease codes",
            "New rare disease classifications",
            "Enhanced injury codes",
            "Improved substance use disorder criteria"
          ]
        }
      ];
      
      setTerminologyUpdates(prev => [...mockUpdates, ...prev]);
      toast({
        title: "Updates Refreshed",
        description: "Latest terminology updates have been fetched.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch latest updates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Zap className="h-4 w-4" />;
      case "bugfix":
        return <Bug className="h-4 w-4" />;
      case "major":
        return <Star className="h-4 w-4" />;
      case "icd-11":
        return <Globe className="h-4 w-4" />;
      case "ayush":
        return <FileText className="h-4 w-4" />;
      case "who":
        return <Globe className="h-4 w-4" />;
      case "terminology":
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "feature":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Feature</Badge>;
      case "bugfix":
        return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">Bug Fix</Badge>;
      case "major":
        return <Badge variant="destructive" className="bg-purple-500 hover:bg-purple-600">Major</Badge>;
      case "icd-11":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">ICD-11</Badge>;
      case "ayush":
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">AYUSH</Badge>;
      case "who":
        return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">WHO</Badge>;
      case "terminology":
        return <Badge variant="secondary">Terminology</Badge>;
      default:
        return <Badge variant="outline">Update</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-8 space-y-6">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Updates & Terminology</h1>
        <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
          Stay up to date with the latest terminology standards, platform features, and improvements.
        </p>
      </div>

      {/* Terminology Updates Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary">Terminology Updates</h2>
          <Button 
            onClick={fetchTerminologyUpdates} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Updates
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {terminologyUpdates.map((update) => (
            <Card key={update.id} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(update.type)}
                    <CardTitle className="text-lg sm:text-xl">{update.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTypeBadge(update.type)}
                    <Badge variant="outline" className="text-xs">
                      {update.source}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(update.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground mb-4 text-sm sm:text-base">{update.description}</p>
                {update.changes && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm">Recent Changes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {update.changes.map((change, index) => (
                        <li key={index}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {update.url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={update.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Source
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Updates Section */}
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary">Platform Updates</h2>
        
        <div className="grid gap-4 sm:gap-6">
          {platformUpdates.map((update) => (
            <Card key={update.version} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(update.type)}
                    <CardTitle className="text-lg sm:text-xl">{update.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTypeBadge(update.type)}
                    <Badge variant="outline" className="font-mono text-xs">
                      {update.version}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(update.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground mb-4 text-sm sm:text-base">{update.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">What's New:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {update.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-primary">Stay Updated</h3>
            <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
              Never miss an update! Follow our changelog for the latest improvements and terminology standards.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Updates;