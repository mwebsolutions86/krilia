import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail, MessageCircle, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // ⚠️ TON NOUVEAU NUMÉRO WHATSAPP OFFICIEL
  const WHATSAPP_NUMBER = "212700103520"; 

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMobileMenuOpen(false);
  };

  const isLangActive = (lng: string) => i18n.language.startsWith(lng);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
      
      {/* ================= HEADER (MENU) ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-tighter text-primary">KRILIA</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.properties')}
              </Link>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.agency')}
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                {t('nav.contact')}
              </a>
              <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {t('nav.admin')}
              </Link>

              {/* SÉLECTEUR DE LANGUE DESKTOP */}
              <div className="flex items-center gap-3 border-l border-border/50 pl-6 ml-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <button onClick={() => changeLanguage('fr')} className={`text-xs font-bold transition-colors ${isLangActive('fr') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>FR</button>
                  <span className="text-muted-foreground/30 text-xs">|</span>
                  <button onClick={() => changeLanguage('en')} className={`text-xs font-bold transition-colors ${isLangActive('en') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>EN</button>
                  <span className="text-muted-foreground/30 text-xs">|</span>
                  <button onClick={() => changeLanguage('ar')} className={`text-xs font-bold transition-colors ${isLangActive('ar') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>AR</button>
                </div>
              </div>

              <Button asChild variant="default" className="bg-primary text-primary-foreground rounded-full px-6">
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </Button>
            </nav>

            <button 
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              
              <div className="flex items-center justify-center gap-4 py-4 border-b border-border/50 bg-secondary/20 rounded-lg mb-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <button onClick={() => changeLanguage('fr')} className={`text-sm font-bold ${isLangActive('fr') ? 'text-primary' : 'text-muted-foreground'}`}>FR</button>
                <button onClick={() => changeLanguage('en')} className={`text-sm font-bold ${isLangActive('en') ? 'text-primary' : 'text-muted-foreground'}`}>EN</button>
                <button onClick={() => changeLanguage('ar')} className={`text-sm font-bold ${isLangActive('ar') ? 'text-primary' : 'text-muted-foreground'}`}>AR</button>
              </div>

              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-border/50">
                {t('nav.properties')}
              </Link>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-border/50">
                {t('nav.agency')}
              </a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-border/50">
                {t('nav.contact')}
              </a>
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-medium border-b border-border/50 text-muted-foreground">
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* ================= FOOTER TRADUIT ================= */}
      <footer id="contact" className="bg-zinc-950 text-zinc-300 py-16 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* COLONNE 1 : À PROPOS */}
            <div className="space-y-4">
              <h3 className="font-serif text-3xl text-white tracking-tighter">KRILIA</h3>
              <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
                {t('footer.description')}
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>

            {/* COLONNE 2 : LIENS */}
            <div className="space-y-4">
              <h4 className="text-white font-medium uppercase tracking-wider text-sm">{t('footer.useful_links')}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">{t('footer.all_properties')}</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.booking_terms')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('footer.legal')}</a></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">{t('footer.owner_space')}</Link></li>
              </ul>
            </div>

            {/* COLONNE 3 : CONTACT */}
            <div className="space-y-4">
              <h4 className="text-white font-medium uppercase tracking-wider text-sm">{t('footer.contact_us')}</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-zinc-500 shrink-0" />
                  <span>{t('footer.address')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-zinc-500 shrink-0" />
                  <a href={`tel:+${WHATSAPP_NUMBER}`} className="hover:text-white transition-colors">+{WHATSAPP_NUMBER}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-zinc-500 shrink-0" />
                  <a href="mailto:mazouzwebsolutions@gmail.com" className="hover:text-white transition-colors">contact@krilia.ma</a>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="mt-16 pt-8 border-t border-zinc-800 text-sm text-center text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Krilia. {t('footer.rights')}</p>
            <p>{t('footer.developed_by')} <a href="#" className="text-zinc-400 hover:text-white transition-colors">Mazouz Web Solutions</a></p>
          </div>
        </div>
      </footer>

      {/* ================= BOUTON WHATSAPP FLOTTANT ================= */}
      <a 
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20Krilia,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20disponibilités.`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-[#25D366]/50 transition-all duration-300 group"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        {/* 🌍 Magie RTL : end-full et me-4 adaptent la bulle en arabe ! */}
        <span className="absolute end-full me-4 top-1/2 -translate-y-1/2 bg-white text-zinc-900 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {t('footer.whatsapp_tooltip')}
        </span>
      </a>

    </div>
  );
}