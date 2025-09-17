import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, Zap, Bug, Plus } from "lucide-react";

const Updates = () => {
  const updates = [
    {
      id: 1,
      version: "v2.1.0",
      date: "2024-01-15",
      type: "feature",
      title: "Enhanced Real-time Processing",
      description: "Improved processing speed by 40% with new optimized algorithms for NAMASTE to ICD-11 conversion.",
      items: [
        "New real-time progress indicators",
        "Batch processing for large CSV files",
        "Enhanced error handling and validation",
        "Improved FHIR bundle generation"
      ]
    },
    {
      id: 2,
      version: "v2.0.5",
      date: "2024-01-10",
      type: "bugfix",
      title: "CSV Parser Improvements",
      description: "Fixed issues with CSV delimiter detection and special character handling.",
      items: [
        "Better delimiter auto-detection",
        "Support for Unicode characters",
        "Fixed header row processing",
        "Improved error messages"
      ]
    },
    {
      id: 3,
      version: "v2.0.0",
      date: "2024-01-05",
      type: "major",
      title: "Major Platform Update",
      description: "Complete redesign with new sidebar navigation and enhanced user experience.",
      items: [
        "New responsive sidebar navigation",
        "Modern dark/light theme support",
        "Enhanced mobile responsiveness",
        "Updated brand identity as AyuBridge Health",
        "Improved API documentation"
      ]
    },
    {
      id: 4,
      version: "v1.8.2",
      date: "2023-12-28",
      type: "feature",
      title: "API Enhancement",
      description: "New API endpoints for better integration capabilities.",
      items: [
        "Single code conversion endpoint",
        "Batch processing API",
        "Enhanced authentication system",
        "Rate limiting improvements"
      ]
    },
    {
      id: 5,
      version: "v1.8.0",
      date: "2023-12-20",
      type: "feature",
      title: "FHIR Bundle Export",
      description: "Added support for exporting conversion results as FHIR-compliant bundles.",
      items: [
        "FHIR R4 compliance",
        "Structured data export",
        "Metadata preservation",
        "Validation tools"
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Plus className="h-4 w-4" />;
      case "bugfix":
        return <Bug className="h-4 w-4" />;
      case "major":
        return <Star className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "feature":
        return <Badge className="bg-green-500 hover:bg-green-600">Feature</Badge>;
      case "bugfix":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Bug Fix</Badge>;
      case "major":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Major</Badge>;
      default:
        return <Badge>Update</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Platform Updates</h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest features, improvements, and bug fixes in AyuBridge Health.
          </p>
        </div>

        <div className="space-y-6">
          {updates.map((update) => (
            <Card key={update.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(update.type)}
                      <CardTitle className="text-xl">{update.title}</CardTitle>
                    </div>
                    {getTypeBadge(update.type)}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{update.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{update.version}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{update.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold">What's New:</h4>
                  <ul className="space-y-1">
                    {update.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Want to be notified about new updates? Follow our development progress and get early access to new features.
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                Real-time notifications
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Early access features
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Updates;