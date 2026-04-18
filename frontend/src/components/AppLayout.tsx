import { Navigate, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { auth } from "@/lib/auth";
import { Badge } from "./ui/badge";

export const AppLayout = () => {
  if (!auth.isAuthed()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-3">
              <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-glow" />
                Model: Isolation Forest
              </Badge>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
