import { supabase } from '@/lib/supabase';

// Typage strict de ce qui sort de ta base de données
export type Apartment = {
  id: string;
  title: string;
  description: string;
  location: string;
  base_price_per_night: number;
  amenities: string[];
  images: string[];
};

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
export type CreateApartmentDTO = {
  title: string;
  description: string;
  location: string;
  base_price_per_night: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
};

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