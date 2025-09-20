import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import { NamasteCodeSearch } from "@/components/NamasteCodeSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";

const Converter = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading converter...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">NAMASTE to ICD-11 Converter</h1>
          <p className="text-xl text-muted-foreground">
            Search NAMASTE codes for instant ICD-11 mapping or upload CSV files for batch conversion with FHIR bundle generation.
          </p>
        </div>
        
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Codes</TabsTrigger>
            <TabsTrigger value="upload">Batch Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <NamasteCodeSearch />
          </TabsContent>

          <TabsContent value="upload">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Converter;