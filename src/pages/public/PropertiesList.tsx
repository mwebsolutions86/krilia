import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getActiveApartments, type Apartment } from '@/services/apartment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, ArrowUpDown, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PropertiesList() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc'>('recent');

  useEffect(() => {
    async function load() {
      const data = await getActiveApartments();
      setApartments(data);
      setIsLoading(false);
    }
    load();
  }, []);

  // 🪄 MÉTHODE REACT MODERNE : Vider les filtres sans utiliser useEffect (évite le double rendu)
  const [prevLanguage, setPrevLanguage] = useState(i18n.language);
  if (i18n.language !== prevLanguage) {
    setPrevLanguage(i18n.language);
    setSelectedAmenities([]); // On vide les filtres pendant le rendu
  }

  const getLocalizedText = useCallback((apt: Apartment, field: 'title' | 'description' | 'location'): string => {
    const lang = i18n.language || 'fr';
    if (lang.startsWith('ar')) return (apt[`${field}_ar` as keyof Apartment] as string) || apt[field];
    if (lang.startsWith('en')) return (apt[`${field}_en` as keyof Apartment] as string) || apt[field];
    return apt[field];
  }, [i18n.language]);

  // 🪄 NOUVELLE FONCTION POUR TRADUIRE LES TABLEAUX D'ÉQUIPEMENTS
  const getLocalizedAmenities = useCallback((apt: Apartment): string[] => {
    const lang = i18n.language || 'fr';
    if (lang.startsWith('ar') && apt.amenities_ar && apt.amenities_ar.length > 0) return apt.amenities_ar;
    if (lang.startsWith('en') && apt.amenities_en && apt.amenities_en.length > 0) return apt.amenities_en;
    return apt.amenities || [];
  }, [i18n.language]);

  // Les checkboxes s'adaptent maintenant à la langue
  const allAmenities = useMemo(() => {
    const set = new Set<string>();
    apartments.forEach(apt => getLocalizedAmenities(apt).forEach(a => set.add(a)));
    return Array.from(set);
  }, [apartments, getLocalizedAmenities]);

  const filteredApartments = useMemo(() => {
    const result = apartments.filter(apt => {
      const titleText = getLocalizedText(apt, 'title').toLowerCase();
      const locText = getLocalizedText(apt, 'location').toLowerCase();
      const matchesSearch = titleText.includes(search.toLowerCase()) || locText.includes(search.toLowerCase());
      
      const matchesMinPrice = minPrice === '' || apt.base_price_per_night >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || apt.base_price_per_night <= Number(maxPrice);
      
      const matchesAmenities = selectedAmenities.length === 0 || 
        selectedAmenities.every(a => getLocalizedAmenities(apt).includes(a)); // 👈 Filtre sur la bonne langue

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesAmenities;
    });

    if (sortBy === 'price_asc') return [...result].sort((a, b) => a.base_price_per_night - b.base_price_per_night);
    if (sortBy === 'price_desc') return [...result].sort((a, b) => b.base_price_per_night - a.base_price_per_night);
    return result;
  }, [apartments, search, minPrice, maxPrice, selectedAmenities, sortBy, getLocalizedText, getLocalizedAmenities]);

  const resetFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-serif">{t('listing.title', 'Nos Appartements')}</h1>
          <p className="text-muted-foreground">{filteredApartments.length} {t('listing.results', 'logements trouvés')}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <select 
            className="bg-background border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'price_asc' | 'price_desc')}
          >
            <option value="recent">{t('listing.sort.recent', 'Plus récents')}</option>
            <option value="price_asc">{t('listing.sort.price_asc', 'Prix croissant')}</option>
            <option value="price_desc">{t('listing.sort.price_desc', 'Prix décroissant')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t('listing.filter.search', 'Recherche')}</Label>
            <div className="relative">
              <Input placeholder={t('listing.filter.search_placeholder', 'Marina, Salam...')} value={search} onChange={(e) => setSearch(e.target.value)} className={`ps-10 ${isRtl ? 'pe-10 ps-3' : ''}`} />
              <Search className={`absolute top-3 w-4 h-4 text-muted-foreground ${isRtl ? 'end-3' : 'start-3'}`} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t('listing.filter.price', 'Budget par nuit')}</Label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <span className="text-muted-foreground">-</span>
              <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t('listing.filter.amenities', 'Équipements')}</Label>
            <div className="grid grid-cols-1 gap-3">
              {allAmenities.map(amenity => (
                <div key={amenity} className="flex items-center space-x-3 space-x-reverse">
                  <Checkbox 
                    id={amenity} 
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={(checked: boolean | 'indeterminate') => {
                      if (checked === true) setSelectedAmenities(prev => [...prev, amenity]);
                      else if (checked === false) setSelectedAmenities(prev => prev.filter(a => a !== amenity));
                    }}
                  />
                  <label htmlFor={amenity} className="text-sm font-medium leading-none cursor-pointer">{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          <Button variant="ghost" className="w-full text-muted-foreground" onClick={resetFilters}>
            <X className="w-4 h-4 me-2" /> {t('listing.filter.reset', 'Effacer les filtres')}
          </Button>
        </aside>

        <div className="lg:col-span-3">
          {filteredApartments.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <p className="text-muted-foreground mb-4">{t('listing.no_results', 'Aucun appartement ne correspond à vos critères.')}</p>
              <Button variant="outline" onClick={resetFilters}>{t('listing.filter.reset', 'Effacer les filtres')}</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredApartments.map(apt => (
                <Link key={apt.id} to={`/apartment/${apt.id}`}>
                  <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {apt.images && apt.images.length > 0 ? (
                        <img src={apt.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">{t('common.no_photo', 'Sans photo')}</div>
                      )}
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                        {apt.base_price_per_night} {t('home.search.price_unit', 'Dhs')}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase mb-2">
                        <MapPin className="w-3 h-3" /> {getLocalizedText(apt, 'location')}
                      </div>
                      <h3 className="text-xl font-serif mb-2 line-clamp-1">{getLocalizedText(apt, 'title')}</h3>
                      <div className="flex gap-3 text-muted-foreground mt-4">
                        {/* 👈 Utilisation de getLocalizedAmenities sur les petites cartes aussi */}
                        {getLocalizedAmenities(apt).slice(0, 3).map(a => (
                          <div key={a} className="flex items-center gap-1 text-[10px] uppercase font-medium bg-secondary px-2 py-1 rounded">
                            {a}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}