import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getApartmentById, type Apartment } from '@/services/apartment';
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

export default function ApartmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // ÉTAT DE LA GALERIE PHOTO (Pour le SaaS de Visionnage) 👇
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  useEffect(() => {
    async function fetchAppartement() {
      if (!id) return;
      const data = await getApartmentById(id);
      setApartment(data);
      // Au chargement, on définit la première image comme image principale
      if (data && data.images.length > 0) {
        setMainImageUrl(data.images[0]);
      }
      setIsLoading(false);
    }
    fetchAppartement();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!apartment) return <div className="min-h-screen flex items-center justify-center">Bien introuvable.</div>;

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
      toast.success("Demande envoyée avec succès !", {
        description: "Nous vous contacterons très vite pour confirmer.",
      });
      setIsDialogOpen(false);
      setTimeout(() => navigate('/'), 2000);
    } else {
      toast.error("Erreur lors de la réservation", {
        description: "Veuillez réessayer ou nous contacter directement.",
      });
    }
  };

  return (
    <div className="flex-1 animate-in fade-in duration-500 max-w-7xl mx-auto px-6 py-8 w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Retour à la collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLONNE GAUCHE : Galerie et Détails */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* GALERIE PHOTO INTERACTIVE (SaaS PropTech) 👇 */}
          {apartment.images.length > 0 ? (
            <div className="space-y-4">
              {/* IMAGE PRINCIPALE GRANDE RESOLUTION */}
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-black/5 flex items-center justify-center">
                {mainImageUrl ? (
                    <img 
                      src={mainImageUrl} 
                      alt={`${apartment.title} - Image principale`} 
                      className="w-full h-full object-contain animate-in fade-in duration-300" 
                    />
                ) : (
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              {/* LISTE DES MINIATURES CLIQUABLES (Thumbnails) */}
              <div className="flex flex-wrap gap-3 pt-2">
                {apartment.images.map((image, index) => (
                  <button 
                    key={index} 
                    onClick={() => setMainImageUrl(image)} // <--- CLIC QUI CHANGE L'IMAGE PRINCIPALE
                    className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 
                      ${mainImageUrl === image ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105' : 'border-border/50 hover:border-border hover:scale-105'}
                    `}
                  >
                    <img 
                      src={image} 
                      alt={`${apartment.title} - Miniature ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/5 rounded-lg"></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-secondary/20 flex items-center justify-center text-muted-foreground">
              <ImageIcon className="w-12 h-12" /> Aucun bien disponible pour le moment.
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" /> {apartment.location}
            </div>
            <h1 className="text-4xl font-serif mb-6">{apartment.title}</h1>
            <p className="text-muted-foreground leading-relaxed text-lg">{apartment.description}</p>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h3 className="text-xl font-serif mb-4">Équipements inclus</h3>
            <ul className="grid grid-cols-2 gap-4">
              {apartment.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" /> {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLONNE DROITE : Moteur de Réservation */}
        <div className="relative">
          <div className="sticky top-28">
            <Card className="bg-card border-border/50 shadow-2xl">
              <CardHeader className="border-b border-border/50 pb-6">
                <CardTitle className="text-3xl font-light">
                  {apartment.base_price_per_night} Dhs <span className="text-base text-muted-foreground font-normal">/ nuit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="flex justify-center border border-border/50 rounded-lg p-2 bg-background">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    disabled={(d: Date) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </div>

                {days > 0 ? (
                  <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{apartment.base_price_per_night} Dhs x {days} nuits</span>
                      <span>{totalPrice} Dhs</span>
                    </div>
                    <div className="border-t border-border/50 pt-3 flex justify-between font-serif text-xl">
                      <span>Total</span>
                      <span>{totalPrice} Dhs</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Veuillez sélectionner vos dates
                  </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full py-6 text-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
                      disabled={days === 0}
                    >
                      Demander une réservation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">Finaliser la demande</DialogTitle>
                      <DialogDescription>
                        Pour un séjour de {days} nuits ({totalPrice} Dhs). Nous vous recontacterons pour confirmer.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input id="name" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone (WhatsApp)</Label>
                        <Input id="phone" type="tel" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="bg-background" />
                      </div>
                      <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground" disabled={isSubmitting}>
                        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</> : "Confirmer la demande"}
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