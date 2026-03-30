import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Accès refusé", { description: "Identifiants incorrects." });
    } else {
      toast.success("Bienvenue", { description: "Authentification réussie." });
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      
      <Card className="w-full max-w-md relative z-10 bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-primary/20">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-3xl tracking-tight">Accès Sécurisé</CardTitle>
          <CardDescription className="text-muted-foreground">
            Espace réservé à l'administration Mazouz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                placeholder="admin@mazouz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
            <Button type="submit" className="w-full py-6 text-base bg-primary text-primary-foreground hover:opacity-90" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Vérification...</> : "Déverrouiller l'accès"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}