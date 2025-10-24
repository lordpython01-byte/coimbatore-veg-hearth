import { supabase } from './supabase';

export interface PartyHall {
  id: string;
  name: string;
  location: string;
  phone: string;
  maps_url: string;
  capacity_min: number;
  capacity_max: number;
  is_active: boolean;
  display_order: number;
}

export interface BookingData {
  hall_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  booking_date: string;
  purpose: string;
  approval_status?: string;
}

export interface AvailabilityResult {
  isAvailable: boolean;
  alternativeHalls?: PartyHall[];
}

export const fetchPartyHalls = async (): Promise<PartyHall[]> => {
  const { data, error } = await supabase
    .from('party_halls')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data || [];
};

export const checkAvailability = async (
  hallId: string,
  bookingDate: string
): Promise<AvailabilityResult> => {
  const { data, error } = await supabase
    .from('party_hall_bookings')
    .select('id')
    .eq('hall_id', hallId)
    .eq('booking_date', bookingDate)
    .in('approval_status', ['pending', 'approved']);

  if (error) throw error;

  const isAvailable = !data || data.length === 0;

  if (!isAvailable) {
    const allHalls = await fetchPartyHalls();
    const alternativeHalls: PartyHall[] = [];

    for (const hall of allHalls) {
      if (hall.id !== hallId) {
        const { data: existingBookings } = await supabase
          .from('party_hall_bookings')
          .select('id')
          .eq('hall_id', hall.id)
          .eq('booking_date', bookingDate)
          .in('approval_status', ['pending', 'approved']);

        if (!existingBookings || existingBookings.length === 0) {
          alternativeHalls.push(hall);
        }
      }
    }

    return { isAvailable: false, alternativeHalls };
  }

  return { isAvailable: true };
};

export const getBookedDates = async (hallId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('party_hall_bookings')
    .select('booking_date')
    .eq('hall_id', hallId)
    .in('approval_status', ['pending', 'approved']);

  if (error) throw error;

  return data ? data.map((booking) => booking.booking_date) : [];
};

export const createBooking = async (bookingData: BookingData) => {
  const { data, error } = await supabase
    .from('party_hall_bookings')
    .insert({
      ...bookingData,
      approval_status: 'pending',
      status: 'booked',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
