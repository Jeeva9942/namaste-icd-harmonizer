import { useState } from "react";
import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; abhaId: string } | undefined>();

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user: { name: string; abhaId: string }) => {
    setUserInfo(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userInfo={userInfo}
      />
      
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">
                Medical Terminology Integration System
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Seamlessly integrate NAMASTE codes with ICD-11 Traditional Medicine Module 2 (TM2) and Biomedicine classifications for FHIR-compliant Electronic Medical Records
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">NAMASTE Integration</h3>
                <p className="text-sm text-muted-foreground">
                  4,500+ standardized terms for Ayurveda, Siddha, and Unani disorders
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">ICD-11 TM2 Mapping</h3>
                <p className="text-sm text-muted-foreground">
                  529 disorder categories and 196 pattern codes integrated globally
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold mb-2">FHIR R4 Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Export ready for EMR systems with full interoperability support
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleLogin}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Login with ABHA to Get Started
              </button>
              <p className="text-sm text-muted-foreground mt-4">
                Secure authentication using Ayushman Bharat Health Account
              </p>
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
