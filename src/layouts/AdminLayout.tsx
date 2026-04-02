import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, CalendarDays, LogOut, Loader2, Users } from 'lucide-react'; // 👈 Ajout de Users
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<'super_admin' | 'owner' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Récupérer le rôle depuis la table profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setRole(profile.role);
      }
      setIsLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-950 text-white pb-16 md:pb-0">
      
      {/* 💻 SIDEBAR (CACHÉE SUR MOBILE, VISIBLE SUR PC) */}
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-zinc-900/50 flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <span className="font-serif text-xl tracking-widest text-primary">
            {role === 'super_admin' ? 'KRILIA ADMIN' : 'MON ESPACE'}
          </span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link to="/admin" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Vue d'ensemble
          </Link>
          
          {/* Seul le super_admin peut voir la gestion des biens et des partenaires */}
          {role === 'super_admin' && (
            <>
              <Link to="/admin/properties" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${isActive('/admin/properties') ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-white/5'}`}>
                <Home className="w-5 h-5" /> Catalogue Biens
              </Link>
              
              <Link to="/admin/owners" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${isActive('/admin/owners') ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-white/5'}`}>
                <Users className="w-5 h-5" /> Partenaires
              </Link>
            </>
          )}
          
          <Link to="/admin/bookings" className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm ${isActive('/admin/bookings') ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-white/5'}`}>
            <CalendarDays className="w-5 h-5" /> Réservations
          </Link>
          
          <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-white/5 transition-colors font-medium text-sm">
              <Home className="w-5 h-5" /> Retour au site public
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors font-medium text-sm">
              <LogOut className="w-5 h-5" /> Déconnexion
            </button>
          </div>
        </nav>
      </aside>

      {/* 📱 BOTTOM NAVIGATION BAR (VISIBLE UNIQUEMENT SUR MOBILE) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between pb-safe">
        <Link to="/admin" className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-primary' : 'text-zinc-500'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] font-medium">Accueil</span>
        </Link>
        
        {role === 'super_admin' && (
          <>
            <Link to="/admin/properties" className={`flex flex-col items-center gap-1 ${isActive('/admin/properties') ? 'text-primary' : 'text-zinc-500'}`}>
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">Biens</span>
            </Link>
            <Link to="/admin/owners" className={`flex flex-col items-center gap-1 ${isActive('/admin/owners') ? 'text-primary' : 'text-zinc-500'}`}>
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-medium">Partenaires</span>
            </Link>
          </>
        )}

        <Link to="/admin/bookings" className={`flex flex-col items-center gap-1 ${isActive('/admin/bookings') ? 'text-primary' : 'text-zinc-500'}`}>
          <CalendarDays className="w-6 h-6" />
          <span className="text-[10px] font-medium">Demandes</span>
        </Link>

        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-500/70 hover:text-red-500">
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Sortir</span>
        </button>
      </nav>

      {/* C'est ici que les pages admin (Dashboard, Bookings, Owners) s'affichent */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet context={{ role }} /> 
      </main>
    </div>
  );
}