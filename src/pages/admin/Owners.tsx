import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type OwnerProfile = {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
};

export default function Owners() {
  const [owners, setOwners] = useState<OwnerProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const loadOwners = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('role', 'owner');
    if (data) setOwners(data as OwnerProfile[]);
  };

  useEffect(() => {
    // Correction de l'erreur ESLint
    const init = async () => {
      await loadOwners();
      setIsLoading(false);
    };
    init();
  }, []);

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      toast.error("Erreur", { description: error.message });
    } else {
      if (data.user) {
        await supabase.from('profiles').update({ phone }).eq('id', data.user.id);
      }
      toast.success("Propriétaire créé !");
      loadOwners(); // Recharge la liste
    }
    setIsAdding(false);
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Propriétaires Partenaires</h1>
          <p className="text-muted-foreground">Gérez les comptes d'accès pour vos propriétaires.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2"><UserPlus className="w-4 h-4" /> Ajouter un propriétaire</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Créer un accès Propriétaire</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOwner} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input required value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email (Identifiant)</Label>
                <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Téléphone (WhatsApp)</Label>
                <Input type="tel" placeholder="212..." required value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe provisoire</Label>
                <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isAdding}>
                {isAdding ? <Loader2 className="animate-spin" /> : "Générer l'accès"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.map(owner => (
          <Card key={owner.id} className="border-border/50 bg-zinc-900/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {owner.full_name?.charAt(0) || 'O'}
                </div>
                <CardTitle className="text-lg">{owner.full_name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="w-4 h-4" /> {owner.phone}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Inscrit le {new Date(owner.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}