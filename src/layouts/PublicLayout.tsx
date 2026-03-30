import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar Publique */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif tracking-widest uppercase">Mazouz</Link>
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Notre Vision</Link>
            {/* Lien discret vers ton interface d'administration */}
            <Link to="/admin" className="px-4 py-2 rounded-full border border-border hover:bg-secondary transition-all">
              Espace Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* C'est ici que les pages publiques (comme Home) s'afficheront */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}