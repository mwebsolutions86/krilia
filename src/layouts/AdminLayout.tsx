import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Home, CalendarDays } from 'lucide-react';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-border/50 bg-card flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border/50">
          <span className="font-serif text-xl tracking-widest uppercase text-primary">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-secondary text-secondary-foreground transition-colors font-medium text-sm">
            <LayoutDashboard className="w-4 h-4" /> Vue d'ensemble
          </Link>
          <Link to="/admin/properties" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary/50 transition-colors font-medium text-sm">
    <Home className="w-4 h-4" /> Mes Biens
  </Link>
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary/50 transition-colors font-medium text-sm">
            <CalendarDays className="w-4 h-4" /> Calendrier
          </Link>
          
          {/* Pousse le bouton retour en bas de la sidebar */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary/50 transition-colors font-medium text-sm">
              <Home className="w-4 h-4" /> Retour au site
            </Link>
          </div>
        </nav>
      </aside>

      {/* C'est ici que les pages admin (comme Dashboard) s'afficheront */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}