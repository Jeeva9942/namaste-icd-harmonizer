import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Heart, Shield, Zap, Globe, Users, Activity, BookOpen, FileText, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-medical-tech.jpg";
import collaborationImage from "@/assets/healthcare-collaboration.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 -mt-6">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight">
                  Bridge Traditional & Modern Healthcare
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  Seamlessly convert between ICD-11 and AYUSH medical codes with our advanced AI-powered platform. 
                  Enhancing healthcare interoperability across traditional and modern medicine systems.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  <Link to="/converter">
                    Start Converting <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                  <Link to="/api-docs">
                    <BookOpen className="mr-2 h-5 w-5" />
                    API Docs
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:order-last">
              <img 
                src={heroImage} 
                alt="Modern healthcare technology integration" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
              Powerful Features for Healthcare Integration
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
              Experience the future of medical coding with our comprehensive suite of tools designed for healthcare professionals.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Convert thousands of medical codes in seconds with our optimized processing engine.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  HIPAA compliant platform ensuring your medical data remains protected and secure.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">AI-Powered</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Advanced machine learning algorithms ensure accurate code mapping and suggestions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Global Standards</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Support for international medical coding standards including ICD-11 and AYUSH systems.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Collaborative</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Team-friendly features for healthcare organizations and research institutions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg sm:text-xl">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm sm:text-base">
                  Monitor conversion accuracy and track usage patterns with detailed analytics.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <img 
                src={collaborationImage} 
                alt="Healthcare collaboration between traditional and modern medicine" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                Bridging Ancient Wisdom with Modern Science
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                AyushBridge is dedicated to creating seamless integration between traditional AYUSH 
                medicine systems and modern healthcare protocols. Our mission is to preserve the valuable 
                knowledge of traditional medicine while making it accessible and compatible with contemporary 
                medical practices.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <strong className="text-foreground">Preserve Traditional Knowledge:</strong> Maintain the integrity 
                    of ancient medical wisdom while adapting to modern standards.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <strong className="text-foreground">Enhance Interoperability:</strong> Enable seamless communication 
                    between different healthcare systems and practitioners.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    <strong className="text-foreground">Improve Patient Care:</strong> Facilitate better treatment 
                    outcomes through integrated approach to healthcare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
              Ready to Transform Healthcare Integration?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0">
              Join thousands of healthcare professionals who trust AyushBridge for 
              accurate medical code conversion and seamless system integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                <Link to="/converter">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                <FileText className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;