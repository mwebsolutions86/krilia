

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-xl border bg-card text-card-foreground shadow-2xl space-y-4">
        <h1 className="text-3xl font-serif tracking-tight">Système Opérationnel</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Le design system "Dark PropTech" est en place. Les couleurs, la typographie et l'architecture sont prêtes pour la production.
        </p>
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity">
          Initialiser le SaaS
        </button>
      </div>
    </div>
  );
}