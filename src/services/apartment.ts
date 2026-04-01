import { supabase } from '@/lib/supabase';

// 1. Typage strict de l'appartement (Modèle de données)
export type Apartment = {
  id: string;
  title: string;
  title_en?: string;   
  title_ar?: string;
  location: string;
  location_en?: string;
  location_ar?: string;
  description: string;
  description_en?: string;
  description_ar?: string;
  base_price_per_night: number;
  amenities: string[];
  amenities_en?: string[]; // 👈 Ajouté
  amenities_ar?: string[]; // 👈 Ajouté
  images: string[];
  is_active: boolean;
  created_at?: string;
};

// 2. DTO pour la Création / Mise à jour (On ajoute les champs de traduction ici aussi !)
export type CreateApartmentDTO = {
  title: string;
  title_en?: string;    
  title_ar?: string;    
  description: string;
  description_en?: string; 
  description_ar?: string; 
  location: string;
  location_en?: string;    
  location_ar?: string;    
  base_price_per_night: number;
  amenities: string[];
  amenities_en?: string[]; // 👈 Ajouté
  amenities_ar?: string[]; // 👈 Ajouté
  images: string[];
  is_active: boolean;
};

// Lecture de tous les biens actifs
export async function getActiveApartments(): Promise<Apartment[]> {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur Supabase :', error.message);
    return [];
  }
  
  return data || [];
}

// Lecture d'un bien spécifique
export async function getApartmentById(id: string): Promise<Apartment | null> {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur Supabase (getApartmentById) :', error.message);
    return null;
  }
  
  return data;
}

// Création d'un bien (Inclut désormais les traductions si présentes)
export async function createApartment(apartmentData: CreateApartmentDTO) {
  const { data, error } = await supabase
    .from('apartments')
    .insert([apartmentData])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création du bien :', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}

// Mise à jour d'un bien
export async function updateApartment(id: string, apartmentData: Partial<CreateApartmentDTO>) {
  const { data, error } = await supabase
    .from('apartments')
    .update(apartmentData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la modification du bien :', error.message);
    return { success: false, error: error.message };
  }
  
  return { success: true, data };
}