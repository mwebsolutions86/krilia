import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Remonte tout en haut, tout à gauche, instantanément
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Ce composant n'affiche rien visuellement
}