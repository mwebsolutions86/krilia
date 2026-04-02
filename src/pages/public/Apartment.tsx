import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getApartmentById, getBlockedDates, type Apartment } from '@/services/apartment'; // 👈 getBlockedDates ajouté
import { createBooking } from '@/services/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, ChevronLeft, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function ApartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<{ start_date: string; end_date: string }[]>([]);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // 🪄 TRADUCTION TEXTES
  const getLocalizedText = (apt: Apartment, field: 'title' | 'description' | 'location'): string => {
    const lang = i18n.language || 'fr';
    if (lang.startsWith('ar')) return (apt[`${field}_ar` as keyof Apartment] as string) || apt[field];
    if (lang.startsWith('en')) return (apt[`${field}_en` as keyof Apartment] as string) || apt[field];
    return apt[field];
  };

  // 🪄 TRADUCTION ÉQUIPEMENTS (TABLEAUX)
  const getLocalizedAmenities = (apt: Apartment): string[] => {
    const lang = i18n.language || 'fr';
    if (lang.startsWith('ar') && apt.amenities_ar && apt.amenities_ar.length > 0) return apt.amenities_ar;
    if (lang.startsWith('en') && apt.amenities_en && apt.amenities_en.length > 0) return apt.amenities_en;
    return apt.amenities || [];
  };

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      
      // 1. Récupérer l'appartement
      const data = await getApartmentById(id);
      setApartment(data);
      if (data && data.images.length > 0) {
        setMainImageUrl(data.images[0]);
      }

      // 2. Récupérer les dates indisponibles pour ce bien
      const dates = await getBlockedDates(id);
      setBlockedDates(dates);

      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  // 🪄 LOGIQUE DE DÉSACTIVATION DES DATES SUR LE CALENDRIER
  const isDateDisabled = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 1. Bloquer dates passées
    if (d < today) return true;

    // 2. Bloquer dates confirmées en BDD
    return blockedDates.some(range => {
      const start = new Date(range.start_date);
      const end = new Date(range.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return d >= start && d <= end;
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">{t('apartment.loading', 'Chargement...')}</div>;
  if (!apartment) return <div className="min-h-screen flex items-center justify-center">{t('apartment.not_found', 'Bien introuvable.')}</div>;

  const days = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = days > 0 ? days * apartment.base_price_per_night : 0;

 const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || !id) return;

    setIsSubmitting(true);

    const result = await createBooking({
      apartment_id: id,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      start_date: format(date.from, 'yyyy-MM-dd'),
      end_date: format(date.to, 'yyyy-MM-dd'),
      total_price: totalPrice,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(t('apartment.toast.success_title', 'Demande enregistrée !'), {
        description: t('apartment.toast.success_desc', 'Ouverture de WhatsApp en cours...'),
      });
      setIsDialogOpen(false);

      // 🪄 MAGIE WHATSAPP : Nettoyage du numéro et création du lien
      const cleanPhone = (result.ownerPhone || '').replace(/[^0-9]/g, ''); 
      
      const message = `Bonjour, je viens de faire une demande de réservation pour le bien "${result.aptTitle}" du ${format(date.from, 'dd/MM/yyyy')} au ${format(date.to, 'dd/MM/yyyy')} via l'agence Krilia.\n\nVoici mes coordonnées :\nNom : ${guestName}\nTéléphone : ${guestPhone}\n\nPouvez-vous me confirmer la disponibilité ?`;
      
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

      // 1. Lance l'ouverture de WhatsApp (Nouvel onglet sur PC / Ouvre l'App sur Mobile)
      window.open(whatsappUrl, '_blank');

      // 2. Redirige l'onglet actuel vers l'accueil avec un mini-délai pour ne pas bloquer l'ouverture de l'App sur mobile
      setTimeout(() => {
        navigate('/');
      }, 500); 

    } else {
      toast.error(t('apartment.toast.error_title', 'Erreur lors de la réservation'), {
        description: t('apartment.toast.error_desc', 'Veuillez réessayer ou nous contacter directement.'),
      });
    }
  };

  return (
    <div className="flex-1 animate-in fade-in duration-500 max-w-7xl mx-auto px-6 py-8 w-full">
      <Link to="/apartments" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /> {t('apartment.back_button', 'Retour à la collection')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          
          {apartment.images.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-black/5 flex items-center justify-center">
                {mainImageUrl ? (
                    <img src={mainImageUrl} alt={`${getLocalizedText(apartment, 'title')}`} className="w-full h-full object-contain animate-in fade-in duration-300" />
                ) : (
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {apartment.images.map((image, index) => (
                  <button 
                    key={index} 
                    onClick={() => setMainImageUrl(image)} 
                    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${mainImageUrl === image ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105' : 'border-border/50 hover:border-border hover:scale-105'}`}
                  >
                    <img src={image} alt="Miniature" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/5 rounded-lg"></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-secondary/20 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-12 h-12" /> {t('apartment.no_property_available', 'Aucun bien disponible pour le moment.')}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" /> {getLocalizedText(apartment, 'location')}
            </div>
            <h1 className="text-4xl font-serif mb-6">{getLocalizedText(apartment, 'title')}</h1>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">{getLocalizedText(apartment, 'description')}</p>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h3 className="text-xl font-serif mb-4">{t('apartment.included_amenities', 'Équipements inclus')}</h3>
            <ul className="grid grid-cols-2 gap-4">
              {getLocalizedAmenities(apartment).map((amenity, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" /> {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Moteur de réservation */}
        <div className="relative">
          <div className="sticky top-28">
            <Card className="bg-card border-border/50 shadow-2xl">
              <CardHeader className="border-b border-border/50 pb-6">
                <CardTitle className="text-3xl font-light">
                  {apartment.base_price_per_night} {t('home.search.price_unit', 'Dhs')} <span className="text-base text-muted-foreground font-normal">/ {t('apartment.per_night', 'nuit')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex justify-center border border-border/50 rounded-lg p-2 bg-background">
                  <Calendar 
                    mode="range" 
                    selected={date} 
                    onSelect={setDate} 
                    numberOfMonths={1} 
                    disabled={isDateDisabled} // 👈 ICI, le calendrier utilise la nouvelle fonction !
                  />
                </div>
                {days > 0 ? (
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{apartment.base_price_per_night} {t('home.search.price_unit', 'Dhs')} x {days} {t('apartment.nights', 'nuits')}</span>
                      <span>{totalPrice} {t('home.search.price_unit', 'Dhs')}</span>
                    </div>
                    <div className="border-t border-border/50 pt-3 flex justify-between font-serif text-xl">
                      <span>{t('apartment.total', 'Total')}</span>
                      <span>{totalPrice} {t('home.search.price_unit', 'Dhs')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">{t('apartment.select_dates', 'Veuillez sélectionner vos dates')}</div>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full py-6 text-lg bg-primary text-primary-foreground hover:opacity-90 transition-all" disabled={days === 0}>
                      {t('apartment.request_booking', 'Demander une réservation')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">{t('apartment.dialog.title', 'Finaliser la demande')}</DialogTitle>
                      <DialogDescription>
                        {t('apartment.dialog.desc_part1', 'Pour un séjour de')} {days} {t('apartment.dialog.desc_part2', 'nuits')} ({totalPrice} {t('home.search.price_unit', 'Dhs')}). {t('apartment.dialog.desc_part3', 'Nous vous recontacterons pour confirmer.')}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('apartment.form.name_label', 'Nom complet')}</Label>
                        <Input id="name" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('apartment.form.email_label', 'Email')}</Label>
                        <Input id="email" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('apartment.form.phone_label', 'Téléphone (WhatsApp)')}</Label>
                        <Input id="phone" type="tel" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="bg-background" />
                      </div>
                      <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('apartment.form.sending', 'Envoi en cours...')}</> : t('apartment.form.submit_btn', 'Confirmer la demande')}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}