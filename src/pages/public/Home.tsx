import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Filter, Star, Smartphone, Key, MessageCircle } from 'lucide-react';
import { getActiveApartments, type Apartment } from '@/services/apartment';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// IMAGES
import hero1 from '@/assets/hero1.webp';
import hero2 from '@/assets/hero2.webp';
import hero3 from '@/assets/hero3.webp';
import hero4 from '@/assets/hero4.webp';
import hero5 from '@/assets/hero5.webp';

const HERO_IMAGES = [hero1, hero2, hero3, hero4, hero5];

const getDirectionalClipPath = (index: number) => {
  const paths = ['inset(100% 0 0 0)', 'inset(0 0 0 100%)', 'inset(0 0 100% 0)', 'inset(0 100% 0 0)'];
  return paths[index % 4];
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [prevHeroIndex, setPrevHeroIndex] = useState(HERO_IMAGES.length - 1);
  const [searchLocation, setSearchLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // 🪄 LA FONCTION DE TRADUCTION DYNAMIQUE (AJOUTÉE ICI)
  const getLocalizedText = (apt: Apartment, field: 'title' | 'description' | 'location') => {
    const lang = i18n.language || 'fr';
    if (lang.startsWith('ar')) return apt[`${field}_ar` as keyof Apartment] || apt[field];
    if (lang.startsWith('en')) return apt[`${field}_en` as keyof Apartment] || apt[field];
    return apt[field];
  };

  useEffect(() => {
    async function fetchAppartements() {
      const data = await getActiveApartments();
      setApartments(data);
      setIsLoading(false);
    }
    fetchAppartements();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setPrevHeroIndex(currentHeroIndex);
        setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentHeroIndex]);

  const filteredApartments = apartments.filter(apt => {
    const matchLocation = searchLocation.trim() === '' || apt.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchPrice = maxPrice.trim() === '' || isNaN(Number(maxPrice)) || apt.base_price_per_night <= Number(maxPrice);
    return matchLocation && matchPrice;
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-6 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full bg-zinc-950"
              style={{ 
                zIndex: index === currentHeroIndex ? 20 : (index === prevHeroIndex ? 10 : 0), 
                clipPath: index === currentHeroIndex ? 'inset(0 0 0 0)' : getDirectionalClipPath(index),
                transition: index === currentHeroIndex ? 'clip-path 1.5s cubic-bezier(0.77, 0, 0.175, 1)' : 'none'
              }}
            >
              <img src={img} className="w-full h-full object-cover opacity-60" style={{ transform: index === currentHeroIndex ? 'scale(1)' : 'scale(1.1)', transition: 'transform 10s ease-out' }} alt="" />
            </div>
          ))}
        </div>
        <div className="relative z-30 max-w-4xl space-y-6 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-4">
            <Star className="w-4 h-4 text-primary fill-primary" /> {t('home.hero.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter text-white">
            {t('home.hero.title_part1')} <span className="italic text-primary">{t('home.hero.title_italic')}</span> {t('home.hero.title_part2')}
          </h1>
          <p className="text-xl text-zinc-200 font-light max-w-2xl mx-auto">{t('home.hero.subtitle')}</p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="px-6 relative z-40 -mt-24 md:-mt-16">
        <div className="max-w-4xl mx-auto bg-background/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 md:p-8 flex flex-col md:flex-row gap-6 items-end">
          <div className="w-full md:flex-1 space-y-3">
            <label className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2 px-2"><MapPin className="w-4 h-4" /> {t('home.search.location_label')}</label>
            <div className="relative">
              <Input placeholder={t('home.search.location_placeholder')} value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="ps-12 h-14 bg-secondary/50 border-transparent text-lg" />
              <Search className="w-6 h-6 absolute start-4 top-4 text-muted-foreground" />
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-3">
            <label className="text-sm font-bold uppercase text-muted-foreground flex items-center gap-2 px-2"><Filter className="w-4 h-4" /> {t('home.search.price_label')}</label>
            <div className="relative">
              <Input type="number" placeholder="Ex: 1500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="ps-4 pe-14 h-14 bg-secondary/50 border-transparent text-lg" />
              <span className="absolute end-5 top-4 text-muted-foreground font-medium">{t('home.search.price_unit')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 py-24 bg-secondary/20 border-t border-b border-border/50 mt-12">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif mb-6">{t('home.timeline.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('home.timeline.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 relative">
            <div className="hidden md:block absolute top-10 start-[15%] end-[15%] h-[1px] bg-border" />
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative flex flex-col items-center group">
                <div className="w-20 h-20 rounded-2xl bg-background border border-border/50 flex items-center justify-center z-10 mb-8 group-hover:-translate-y-2 transition-all duration-500 shadow-sm">
                  {step === 1 ? <Smartphone className="text-primary w-8 h-8" /> : step === 2 ? <Key className="text-primary w-8 h-8" /> : <MessageCircle className="text-primary w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold mb-4 font-serif">{t(`home.timeline.step${step}_title`)}</h3>
                <p className="text-muted-foreground text-sm max-w-[280px]">{t(`home.timeline.step${step}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LISTING SECTION */}
      <section className="px-6 py-24 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif mb-2">{t('home.collection.title')}</h2>
              <p className="text-muted-foreground">{t('home.collection.subtitle')}</p>
            </div>
            <div className="bg-secondary/50 px-4 py-2 rounded-full border border-border text-sm">
              <span className="text-primary font-bold me-1">{filteredApartments.length}</span> {t('home.collection.results')}
            </div>
          </div>

          {isLoading ? (
             <div className="text-center py-32 font-medium">{t('home.collection.loading')}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredApartments.map((apt) => (
                <Card key={apt.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/40">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={apt.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                    <div className="absolute bottom-4 start-4 bg-background/95 backdrop-blur-md px-4 py-2 rounded-xl text-base font-bold shadow-lg">
                      {apt.base_price_per_night} {t('home.search.price_unit')} 
                      <span className="text-xs font-normal text-muted-foreground"> / {isRtl ? 'ليلة' : 'nuit'}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs text-primary uppercase font-bold mb-3">
                      <MapPin className="w-3.5 h-3.5" /> {getLocalizedText(apt, 'location')}
                    </div>
                    <h3 className="text-2xl font-serif mb-3 line-clamp-1">
                      {getLocalizedText(apt, 'title')}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-8 leading-relaxed">
                      {getLocalizedText(apt, 'description')}
                    </p>
                    <Link to={`/apartment/${apt.id}`} className="w-full">
                      <Button className="w-full bg-zinc-900 text-white hover:bg-primary py-6 rounded-xl">
                        {t('home.collection.view_btn')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}