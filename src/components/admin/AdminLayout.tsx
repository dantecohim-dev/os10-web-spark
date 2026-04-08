import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card/80 backdrop-blur-md px-6 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:block">
                <h2 className="text-sm font-medium text-muted-foreground">Painel Administrativo</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="os-gradient-primary text-primary-foreground text-xs font-bold font-display">
                  AD
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <LogOut className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
