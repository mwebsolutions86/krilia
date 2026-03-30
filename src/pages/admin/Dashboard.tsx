import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Home as HomeIcon, CalendarCheck, TrendingUp, Plus, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getAdminBookings, updateBookingStatus, type Booking } from '@/services/booking';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour la modale de gestion
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

 // ON EMBARQUE TOUT DANS LE USE-EFFECT
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      const data = await getAdminBookings();
      setBookings(data);
      setIsLoading(false);
    }
    
    fetchDashboardData();
  }, []);

  // Fonction de décision (Accepter / Refuser)
  const handleStatusChange = async (newStatus: 'confirmed' | 'cancelled') => {
    if (!selectedBooking) return;
    setIsUpdating(true);

    const result = await updateBookingStatus(selectedBooking.id, newStatus);
    
    setIsUpdating(false);

    if (result.success) {
      toast.success(newStatus === 'confirmed' ? "Réservation confirmée !" : "Réservation annulée.");
      setIsManageDialogOpen(false);
      // On rafraîchit la liste silencieusement
      const updatedData = await getAdminBookings();
      setBookings(updatedData);
    } else {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  // Calculs dynamiques pour tes KPIs
  const activeBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const totalRevenue = activeBookings.reduce((sum, booking) => sum + booking.total_price, 0);
  const pendingRevenue = bookings.filter(b => b.status === 'pending').reduce((sum, booking) => sum + booking.total_price, 0);

  if (isLoading) return <div className="p-8 flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Vue d'ensemble</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue dans votre centre de gestion exclusif.
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" />
          Nouveau blocage manuel
        </Button>
      </div>

      {/* KPIs DYNAMIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Demandes Actives
            </CardTitle>
            <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light">{activeBookings.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Biens en ligne
            </CardTitle>
            <HomeIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light">1</div>
            <p className="text-xs text-muted-foreground mt-2">Appartement Premium</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Chiffre d'Affaires Global
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-light">{totalRevenue} Dhs</div>
            <p className="text-xs text-muted-foreground mt-2">
              Dont {pendingRevenue} Dhs en attente de validation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* LISTE DES DERNIÈRES DEMANDES */}
      <div className="mt-8">
        <Card className="border-border/50 shadow-sm bg-card/50">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Dernières demandes de réservation</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-muted-foreground text-sm py-8 text-center border-2 border-dashed border-border/50 rounded-lg">
                Aucune demande pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-border/50 bg-background hover:border-border transition-colors">
                    <div className="flex items-start gap-4 mb-4 md:mb-0">
                      <div className={`p-2 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500/10' : booking.status === 'cancelled' ? 'bg-red-500/10' : 'bg-secondary'}`}>
                        {booking.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
                         booking.status === 'cancelled' ? <XCircle className="w-5 h-5 text-red-500" /> : 
                         <Clock className="w-5 h-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium">{booking.guest_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Du {format(parseISO(booking.start_date), 'dd MMM', { locale: fr })} au {format(parseISO(booking.end_date), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          📞 {booking.guest_phone} | ✉️ {booking.guest_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-serif text-xl">{booking.total_price} Dhs</p>
                        {booking.status === 'pending' && <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">En attente</span>}
                        {booking.status === 'confirmed' && <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">Confirmé</span>}
                        {booking.status === 'cancelled' && <span className="text-xs uppercase tracking-wider px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">Annulé</span>}
                      </div>
                      
                      {/* BOUTON GÉRER */}
                      <Button 
                        variant={booking.status === 'pending' ? 'default' : 'outline'}
                        className={booking.status === 'pending' ? 'bg-primary text-primary-foreground' : 'border-border'}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsManageDialogOpen(true);
                        }}
                      >
                        {booking.status === 'pending' ? 'Gérer' : 'Détails'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MODALE DE GESTION DE RÉSERVATION */}
      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Gestion de la demande</DialogTitle>
            <DialogDescription>
              Client : {selectedBooking?.guest_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Téléphone</span>
                <span className="font-medium">{selectedBooking?.guest_phone}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 py-2">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-medium">
                  {selectedBooking && format(parseISO(selectedBooking.start_date), 'dd/MM/yyyy')} ➔ {selectedBooking && format(parseISO(selectedBooking.end_date), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-serif text-lg text-primary">{selectedBooking?.total_price} Dhs</span>
              </div>
            </div>
            
            {selectedBooking?.status === 'pending' && (
              <p className="text-xs text-center text-muted-foreground">
                Assurez-vous d'avoir contacté le client avant de confirmer.
              </p>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedBooking?.status === 'pending' ? (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={isUpdating}
                  className="w-full sm:w-auto"
                >
                  Refuser
                </Button>
                <Button 
                  onClick={() => handleStatusChange('confirmed')}
                  disabled={isUpdating}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accepter & Confirmer"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsManageDialogOpen(false)} className="w-full">
                Fermer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}