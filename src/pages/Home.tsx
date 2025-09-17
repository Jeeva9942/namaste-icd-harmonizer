import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical-tech.jpg";
import collaborationImage from "@/assets/healthcare-collaboration.jpg";
import logoImage from "@/assets/ayubridge-logo.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:py-32 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={logoImage} 
                  alt="AyuBridge Health Logo" 
                  className="w-16 h-16 rounded-lg shadow-lg"
                />
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AyuBridge Health
                </h1>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-semibold text-foreground leading-tight">
                Bridging Traditional Medicine with Modern Healthcare
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Seamlessly convert NAMASTE codes to ICD-11 standards. Harmonizing Ayurveda with global healthcare systems for better patient care and research.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/converter">
                  <Button className="text-lg px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90 transition-all duration-300">
                    Start Converting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/api-docs">
                  <Button variant="outline" className="text-lg px-8 py-3 border-primary/20 hover:bg-primary/10">
                    View API Docs
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Medical Technology Innovation" 
                className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Empowering Healthcare Transformation
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform provides cutting-edge tools for healthcare data harmonization, ensuring seamless integration between traditional and modern medical systems.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold mb-4">Lightning Fast</h4>
                <p className="text-muted-foreground">
                  Convert thousands of NAMASTE codes to ICD-11 in seconds with our optimized processing engine.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-medical-teal to-medical-green rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold mb-4">Secure & Reliable</h4>
                <p className="text-muted-foreground">
                  Enterprise-grade security with 99.9% uptime. Your healthcare data is protected with industry-leading encryption.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-medical-blue rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-semibold mb-4">Global Standards</h4>
                <p className="text-muted-foreground">
                  Full compliance with WHO ICD-11 standards, enabling seamless integration with global healthcare systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={collaborationImage} 
                alt="Healthcare Collaboration" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Transform Your Healthcare Data?
              </h3>
              <p className="text-xl text-muted-foreground">
                Join thousands of healthcare professionals who trust AyuBridge Health for their medical coding needs. Experience the future of healthcare data harmonization today.
              </p>
              <Link to="/converter">
                <Button className="text-lg px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90 transition-all duration-300">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;