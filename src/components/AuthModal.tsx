import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, User, Lock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userInfo: { name: string; abhaId: string }) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [abhaId, setAbhaId] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'abha' | 'otp' | 'success'>('abha');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!abhaId.match(/^\d{14}$/)) {
      return;
    }
    
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      
      // Auto-login after 1 second
      setTimeout(() => {
        onLogin({
          name: "Dr. Raj Sharma",
          abhaId: abhaId
        });
        onClose();
        setStep('abha');
        setAbhaId("");
        setOtp("");
      }, 1000);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>ABHA Authentication</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'abha' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Enter your 14-digit ABHA ID</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="abha">ABHA ID</Label>
                  <Input
                    id="abha"
                    type="text"
                    placeholder="12 3456 7890 1234"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value.replace(/\D/g, '').slice(0, 14))}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: 14 digits (e.g., 12345678901234)
                  </p>
                </div>

                <Button 
                  onClick={handleSendOTP}
                  disabled={!abhaId.match(/^\d{14}$/) || isLoading}
                  className="w-full bg-primary hover:bg-primary-hover"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'otp' && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Enter the OTP sent to your registered mobile</span>
                </div>

                <div className="text-center">
                  <Badge variant="secondary">
                    ABHA ID: {abhaId.replace(/(\d{2})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="otp">6-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="font-mono text-center text-lg tracking-widest"
                  />
                </div>

                <Button 
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full bg-primary hover:bg-primary-hover"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep('abha')}
                  className="w-full"
                >
                  Back to ABHA ID
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 'success' && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-success mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">Authentication Successful</h3>
                    <p className="text-sm text-muted-foreground">
                      Logging you into the Medical Terminology System...
                    </p>
                  </div>
                  <div className="animate-pulse">
                    <div className="h-2 bg-primary/20 rounded-full">
                      <div className="h-2 bg-primary rounded-full animate-pulse" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>Secured by ABHA (Ayushman Bharat Health Account)</p>
            <p>OAuth 2.0 | ISO 22600 Compliant | Audit Trail Enabled</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};