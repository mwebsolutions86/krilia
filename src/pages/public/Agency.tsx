import { useTranslation } from 'react-i18next';
import { Shield, TrendingUp, Key, Star, Sparkles, Building, ArrowRight, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Agency() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const WHATSAPP_NUMBER = "212700103520"; 

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex-1 flex flex-col bg-zinc-950 text-white font-sans overflow-hidden">
      
      {/* HERO SECTION FUTURISTE */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32">
        {/* Effets de lumière (Glows) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none opacity-50" />
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            {t('agency.hero.badge', "L'excellence immobilière à Agadir")}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter leading-[1.1]">
            {t('agency.hero.title_part1', "Redéfinir l'art de ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 italic font-light">
              {t('agency.hero.title_italic', "recevoir")}
            </span>
          </h1>
          <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
            {t('agency.hero.subtitle', "Krilia n'est pas qu'une agence. C'est une promesse de sérénité pour les propriétaires et la garantie d'un séjour inoubliable pour les voyageurs.")}
          </p>
        </div>
      </section>

      {/* SECTION VOYAGEURS (B2C) */}
      <section className="py-24 px-6 relative border-t border-white/5 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-serif">
                {t('agency.guests.title', "Vous cherchez un séjour parfait ?")}
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {t('agency.guests.desc', "Oubliez les mauvaises surprises. Chez Krilia, chaque appartement est rigoureusement sélectionné, inspecté et préparé pour vous offrir un confort digne de l'hôtellerie.")}
              </p>
              <ul className="space-y-6">
                {[
                  { icon: <Star />, title: t('agency.guests.feat1_title', "Standards Hôteliers"), desc: t('agency.guests.feat1_desc', "Linge de maison premium et propreté clinique garantie.") },
                  { icon: <Shield />, title: t('agency.guests.feat2_title', "Support 24/7"), desc: t('agency.guests.feat2_desc', "Une équipe dédiée à votre écoute durant tout votre séjour.") },
                  { icon: <Key />, title: t('agency.guests.feat3_title', "Check-in Autonome"), desc: t('agency.guests.feat3_desc', "Arrivez à l'heure qui vous convient en toute liberté.") }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <p className="text-zinc-400 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-8 py-6 text-base">
                <Link to="/apartments">
                  {t('agency.guests.cta', "Voir nos appartements")} <ArrowRight className={`w-4 h-4 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Link>
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
              <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" alt="Interior" className="relative z-10 rounded-2xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/5]" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION PROPRIÉTAIRES (B2B) */}
      <section className="py-32 px-6 relative bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              {t('agency.owners.title', "Propriétaires, maximisez vos revenus.")}
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              {t('agency.owners.desc', "Confiez-nous vos clés. Nous transformons votre bien immobilier en une machine à générer des revenus passifs, sans aucun effort de votre part.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <TrendingUp className="w-8 h-8" />, title: t('agency.owners.feat1_title', "Rentabilité Optimisée"), desc: t('agency.owners.feat1_desc', "Ajustement dynamique des prix pour maximiser le taux d'occupation et vos revenus.") },
              { icon: <Building className="w-8 h-8" />, title: t('agency.owners.feat2_title', "Gestion Intégrale"), desc: t('agency.owners.feat2_desc', "Ménage, maintenance, communication voyageurs : on s'occupe de tout à 100%.") },
              { icon: <HeartHandshake className="w-8 h-8" />, title: t('agency.owners.feat3_title', "Transparence Totale"), desc: t('agency.owners.feat3_desc', "Accédez à un tableau de bord pour suivre vos réservations et revenus en temps réel.") }
            ].map((feat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-primary mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 relative border-t border-white/5">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif">{t('agency.cta.title', "Prêt à franchir le cap ?")}</h2>
          <p className="text-xl text-zinc-400 font-light">
            {t('agency.cta.desc', "Que vous souhaitiez réserver un séjour ou confier votre bien, notre équipe est à votre disposition sur WhatsApp.")}
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:opacity-90 rounded-full px-10 py-8 text-lg shadow-[0_0_40px_rgba(var(--primary),0.4)]">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
              {t('agency.cta.button', "Discuter avec nous")}
            </a>
          </Button>
        </div>
      </section>

    </div>
  );
}