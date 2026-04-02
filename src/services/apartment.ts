import { supabase } from '@/lib/supabase';

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
  amenities_en?: string[];
  amenities_ar?: string[];
  images: string[];
  is_active: boolean;
  owner_id?: string; // 👈 Ajouté pour le nouveau système
  created_at?: string;
};

export type CreateApartmentDTO = Omit<Apartment, 'id' | 'created_at'>;

// ==========================================
// 1. POUR LE SITE PUBLIC (Tous les biens actifs)
// ==========================================
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

// ==========================================
// 2. POUR LA PAGE D'UN APPARTEMENT
// ==========================================
export async function getApartmentById(id: string): Promise<Apartment | null> {
  const { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// ==========================================
// 3. POUR LE CALENDRIER (Dates bloquées)
// ==========================================
export async function getBlockedDates(apartmentId: string) {
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('start_date, end_date')
    .eq('apartment_id', apartmentId);

  if (error) {
    console.error("Erreur dates bloquées:", error);
    return [];
  }
  return data;
}

// ==========================================
// 4. CRÉATION & MODIFICATION (Super Admin)
// ==========================================
export async function createApartment(apartmentData: CreateApartmentDTO) {
  const { data, error } = await supabase.from('apartments').insert([apartmentData]).select().single();
  return error ? { success: false, error: error.message } : { success: true, data };
}

export async function updateApartment(id: string, apartmentData: Partial<CreateApartmentDTO>) {
  const { data, error } = await supabase.from('apartments').update(apartmentData).eq('id', id).select().single();
  return error ? { success: false, error: error.message } : { success: true, data };
}

// ==========================================
// 5. 🪄 NOUVEAU : POUR LE DASHBOARD (Filtré)
// ==========================================
export async function getAdminApartments(): Promise<Apartment[]> {
  // 1. Savoir qui est connecté
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  // 2. Connaître son rôle
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  // 3. Préparer la requête
  let query = supabase
    .from('apartments')
    .select('*')
    .order('created_at', { ascending: false });

  // 4. FILTRE MAGIQUE : Si c'est un propriétaire, il ne voit que SES biens
  if (profile?.role === 'owner') {
    query = query.eq('owner_id', session.user.id);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Erreur Supabase :', error.message);
    return [];
  }
  return data || [];
}