import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export async function uploadAndCompressImage(file: File): Promise<string | null> {
  try {
    // 1. Configuration de la compression experte (WebP)
    const options = {
      maxSizeMB: 0.8, // Poids max par image (800ko)
      maxWidthOrHeight: 1920, // Résolution max (HD)
      useWebWorker: true,
      fileType: 'image/webp', // Forcer la conversion en WebP
    };

    // 2. Écrasement de l'image
    const compressedFile = await imageCompression(file, options);

    // 3. Création d'un nom unique sécurisé
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    // 4. Envoi dans le Bucket "apartments"
    const { error } = await supabase.storage
      .from('apartments')
      .upload(fileName, compressedFile, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // 5. Récupération de l'URL publique pour la base de données
    const { data: publicUrlData } = supabase.storage
      .from('apartments')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image :", error);
    return null;
  }
}