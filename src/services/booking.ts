import { supabase } from '@/lib/supabase';
import emailjs from '@emailjs/browser';

export type CreateBookingDTO = {
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
};

export type Booking = {
  id: string;
  apartment_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  apartments?: { title: string; owner_id?: string };
};

export async function createBooking(bookingData: CreateBookingDTO) {
  // 1. Créer la réservation dans la BDD
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ ...bookingData, status: 'pending' }])
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase :', error.message);
    return { success: false, error: error.message };
  }

  // 2. 🪄 RÉCUPÉRATION DYNAMIQUE DU NUMÉRO (Proprio ou Agence)
  let targetPhone = ''; 
  let aptTitle = 'Appartement';

  try {
    // On récupère les infos de l'appartement
    const { data: aptData } = await supabase
      .from('apartments')
      .select('title, owner_id')
      .eq('id', bookingData.apartment_id)
      .single();

    if (aptData) {
      aptTitle = aptData.title;

      if (aptData.owner_id) {
        // CAS A : Il y a un propriétaire assigné
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('phone')
          .eq('id', aptData.owner_id)
          .single();
        targetPhone = ownerData?.phone || '';
      } 
      
      // CAS B : Pas de proprio OU le numéro du proprio est vide
      // On cherche alors le numéro du Super Admin (L'Agence Krilia)
      if (!targetPhone) {
        const { data: adminData } = await supabase
          .from('profiles')
          .select('phone')
          .eq('role', 'super_admin')
          .limit(1)
          .single();
        targetPhone = adminData?.phone || '';
      }
    }
  } catch (err) {
    console.error("Erreur lors de la récupération du contact:", err);
  }

  // 3. Envoyer l'email d'archive au Super Admin (toi)
  try {
    await emailjs.send(
      'service_cuj6zbh',   
      'template_1cgujxw',  
      {
        guest_name: bookingData.guest_name,
        guest_phone: bookingData.guest_phone,
        guest_email: bookingData.guest_email,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        total_price: bookingData.total_price,
        to_email: 'mazouzwebsolutions@gmail.com'
      },
      'Dp2zlzSfKtePsmhGG'     
    );
  } catch (emailError) {
    console.error("Erreur EmailJS :", emailError);
  }
  
  // On renvoie le numéro trouvé (soit le proprio, soit l'agence)
  return { 
    success: true, 
    data, 
    ownerPhone: targetPhone, 
    aptTitle 
  };
}

// 🪄 RÉCUPÉRATION FILTRÉE
export async function getAdminBookings(): Promise<Booking[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  let query = supabase
    .from('bookings')
    .select('*, apartments!inner(title, owner_id)')
    .order('created_at', { ascending: false });

  // FILTRE MAGIQUE : Si c'est un owner, on prend que SES réservations
  if (profile?.role === 'owner') {
    query = query.eq('apartments.owner_id', session.user.id);
  }

  const { data, error } = await query;
  if (error) console.error("Erreur :", error.message);

  return data as Booking[] || [];
}

export async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
  return { success: !error, data };
}

// POUR BLOQUER LES DATES
export async function confirmBooking(booking: Booking) {
  const { error: updateError } = await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', booking.id);
  if (updateError) throw updateError;
  
  const { error: blockError } = await supabase.from('blocked_dates').insert([{
    apartment_id: booking.apartment_id,
    booking_id: booking.id,
    start_date: booking.start_date,
    end_date: booking.end_date,
    reason: `Réservation : ${booking.guest_name}`
  }]);
  if (blockError) throw blockError;
  
  return { success: true };
}

// POUR LIBÉRER LES DATES
export async function cancelBooking(id: string) {
  const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
  if (error) throw error;
  await supabase.from('blocked_dates').delete().eq('booking_id', id);
  return { success: true };
}