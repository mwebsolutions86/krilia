import { supabase } from '@/lib/supabase'; // Vérifie que ton instance Supabase est bien ici

/**
 * Appelle la Edge Function 'translate-property' pour traduire 
 * les données d'un appartement via l'IA (Groq/Llama 3).
 * * @param frenchData - Objet contenant le titre, la description et la localisation en français.
 * @returns Un objet contenant les 6 champs traduits (EN et AR).
 */
export async function translatePropertySecurely(frenchData: { 
  title: string; 
  description: string; 
  location: string; 
}) {
  try {
    // On appelle la fonction hébergée sur Supabase
    // .invoke() gère automatiquement l'envoi du Token JWT de l'utilisateur connecté
    const { data, error } = await supabase.functions.invoke('translate-property', {
      body: frenchData,
    });

    if (error) {
      console.error("Erreur lors de l'appel à la Edge Function:", error);
      throw new Error("Impossible de traduire les données pour le moment.");
    }

    // data contient : { title_en, description_en, location_en, title_ar, ... }
    return data;
    
  } catch (err) {
    console.error("Erreur service AI:", err);
    throw err;
  }
}