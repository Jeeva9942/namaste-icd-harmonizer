import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userInfo?: {
    name: string;
    email: string;
  };
}

export const Header = ({ isAuthenticated, onLogin, onLogout, userInfo }: HeaderProps) => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AyushBridge</h1>
              <p className="text-sm text-muted-foreground">NAMASTE ↔ ICD-11 Integration</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{userInfo?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {userInfo?.email}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button onClick={onLogin} className="bg-primary hover:bg-primary-hover">
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};