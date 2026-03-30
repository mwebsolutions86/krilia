import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin  } from 'lucide-react';
import { getActiveApartments, type Apartment } from '@/services/apartment';
import { Link } from 'react-router-dom';

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAppartements() {
      const data = await getActiveApartments();
      setApartments(data);
      setIsLoading(false);
    }
    fetchAppartements();
  }, []);

  return (
    <div className="flex-1 flex flex-col animate-in fade-in duration-700">
      
      {/* SECTION HERO */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[70vh]">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-tight">
            L'Excellence de la <br />
            <span className="italic text-muted-foreground">Location à Agadir.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto">
            Découvrez notre bien d'exception pour un séjour inoubliable. Un design premium, un confort absolu, une expérience unique.
          </p>
        </div>
      </section>

      {/* SECTION NOS BIENS (Connectée à la DB) */}
      <section className="px-6 py-20 bg-card/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif mb-10">Notre Collection</h2>

          {isLoading ? (
            <div className="text-muted-foreground flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Chargement du catalogue...
            </div>
          ) : apartments.length === 0 ? (
            <div className="text-muted-foreground">Aucun bien disponible pour le moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartments.map((apt) => (
                <Card key={apt.id} className="overflow-hidden bg-card border-border/50 hover:border-border transition-all group">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={apt.images[0]} 
                      alt={apt.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                      {apt.base_price_per_night} Dhs <span className="text-xs text-muted-foreground">/nuit</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-3">
                      <MapPin className="w-3 h-3" /> {apt.location}
                    </div>
                    <h3 className="text-xl font-serif mb-2">{apt.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
                      {apt.description}
                    </p>
                    <Link to={`/apartment/${apt.id}`} className="w-full">
  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
    Voir les disponibilités
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