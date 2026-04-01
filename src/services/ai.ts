import { supabase } from '@/lib/supabase';

/**
 * Appelle la Edge Function 'translate-property' pour traduire 
 * les données d'un appartement via l'IA (Groq/Llama 3).
 * @param frenchData - Objet contenant le titre, la description, la localisation et les équipements en français.
 * @returns Un objet contenant les champs traduits (EN et AR).
 */
export async function translatePropertySecurely(frenchData: { 
  title: string; 
  description: string; 
  location: string; 
  amenities?: string; // 👈 AJOUT ICI POUR TYPESCRIPT
}) {
  try {
    const { data, error } = await supabase.functions.invoke('translate-property', {
      body: frenchData,
    });

    if (error) {
      console.error("Erreur lors de l'appel à la Edge Function:", error);
      throw new Error("Impossible de traduire les données pour le moment.");
    }

    return data;
    
  } catch (err) {
    console.error("Erreur service AI:", err);
    throw err;
  }
}