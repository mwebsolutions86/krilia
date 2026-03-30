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
};

export async function createBooking(bookingData: CreateBookingDTO) {
  // 1. Sauvegarde dans Supabase
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('Erreur Supabase :', error.message);
    return { success: false, error: error.message };
  }

  // 2. Envoi via EmailJS
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
    console.log("Krilia System : Email envoyé au propriétaire avec succès !");
  } catch (emailError) {
    console.error("Erreur EmailJS :", emailError);
  }
  
  return { success: true, data };
}

export async function getAdminBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  // On utilise la variable "error" pour satisfaire le linter et faciliter le débogage
  if (error) {
    console.error("Erreur lors du chargement des réservations :", error.message);
  }

  return data || [];
}

export async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled') {
  const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
  return { success: !error, data };
}