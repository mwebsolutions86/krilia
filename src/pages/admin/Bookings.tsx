import { useEffect, useState } from 'react';
import { getAdminBookings, confirmBooking, cancelBooking, type Booking } from '@/services/booking';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar as CalIcon, User, Phone, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getAdminBookings();
      setBookings(data);
    } catch {
      toast.error("Erreur de chargement des réservations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleConfirm = async (booking: Booking) => {
    toast.promise(confirmBooking(booking), {
      loading: 'Confirmation en cours...',
      success: () => {
        loadData();
        return "Réservation confirmée et calendrier bloqué !";
      },
      error: "Erreur lors de la confirmation"
    });
  };

  const handleCancel = async (id: string, isAlreadyConfirmed: boolean) => {
    if (isAlreadyConfirmed) {
      const confirm = window.confirm("Es-tu sûr de vouloir annuler cette réservation ? Cela libérera immédiatement les dates sur le site public.");
      if (!confirm) return;
    }

    try {
      await cancelBooking(id);
      toast.info(isAlreadyConfirmed ? "Réservation annulée, dates libérées !" : "Demande refusée");
      loadData();
    } catch {
      toast.error("Erreur lors de l'annulation");
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-serif">Gestion des Réservations</h1>
        <p className="text-muted-foreground mt-1">Validez les demandes, ou annulez-les pour libérer le calendrier.</p>
      </div>

      <div className="grid gap-6">
        {bookings.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-muted-foreground">
            Aucune réservation enregistrée.
          </div>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-border/50 shadow-sm">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{booking.apartments?.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <User className="w-4 h-4" /> {booking.guest_name}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-600' : 
                        booking.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {booking.status === 'confirmed' && 'CONFIRMÉE'}
                        {booking.status === 'pending' && 'EN ATTENTE'}
                        {booking.status === 'cancelled' && 'ANNULÉE'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalIcon className="w-4 h-4 text-primary" />
                        <span>Du <b>{format(new Date(booking.start_date), 'dd MMMM yyyy', { locale: fr })}</b></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalIcon className="w-4 h-4 text-primary" />
                        <span>Au <b>{format(new Date(booking.end_date), 'dd MMMM yyyy', { locale: fr })}</b></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.guest_phone}</span>
                      </div>
                      <div className="text-lg font-serif text-primary">
                        Total : {booking.total_price} Dhs
                      </div>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="bg-secondary/20 p-6 flex md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-border/50">
                      <Button onClick={() => handleConfirm(booking)} className="bg-green-600 hover:bg-green-700 text-white min-w-[140px]">
                        <Check className="w-4 h-4 mr-2" /> Confirmer
                      </Button>
                      <Button onClick={() => handleCancel(booking.id, false)} variant="outline" className="text-red-500 hover:text-red-600">
                        <X className="w-4 h-4 mr-2" /> Refuser
                      </Button>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="bg-red-500/5 p-6 flex flex-col justify-center items-center gap-3 border-t md:border-t-0 md:border-l border-red-500/20">
                      <Button onClick={() => handleCancel(booking.id, true)} variant="destructive" className="min-w-[140px] shadow-sm">
                        <AlertCircle className="w-4 h-4 mr-2" /> Libérer les dates
                      </Button>
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">
                        Annule la réservation<br/>et débloque le calendrier
                      </span>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}