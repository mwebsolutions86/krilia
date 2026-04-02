import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Layouts & Protection
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import ScrollToTop from '@/components/shared/ScrollToTop'; // 👈 NOUVEL IMPORT

// Pages
import Home from '@/pages/public/Home';
import ApartmentPage from '@/pages/public/Apartment';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/admin/Dashboard';
import Properties from '@/pages/admin/Properties';
import PropertiesList from '@/pages/public/PropertiesList';
import Agency from '@/pages/public/Agency';
import Bookings from '@/pages/admin/Bookings';
import Owners from '@/pages/admin/Owners';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* 👈 MAGIE : Remonte en haut à chaque changement de page */}
      
      <Routes>
        {/* ROUTES PUBLIQUES (Ouvertes à tous) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/apartments" element={<PropertiesList />} /> 
          <Route path="/agency" element={<Agency />} />
          <Route path="/apartment/:id" element={<ApartmentPage />} />
        </Route>

        {/* PAGE DE CONNEXION (Indépendante des layouts) */}
        <Route path="/login" element={<Login />} />

        {/* ROUTES ADMIN (Protégées par la forteresse) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="owners" element={<Owners />} />
          </Route>
        </Route>

        {/* ROUTE DE SECOURS */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
            <h1 className="text-4xl font-serif text-destructive">Erreur 404</h1>
          </div>
        } />
      </Routes>
      <Toaster theme="dark" />
    </BrowserRouter>
  );
}