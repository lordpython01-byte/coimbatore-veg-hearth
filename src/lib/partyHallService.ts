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

export type TimeSlot = 'morning' | 'evening' | 'night';

export interface BookingData {
  hall_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  booking_date: string;
  time_slots: TimeSlot[];
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
  bookingDate: string,
  timeSlots: TimeSlot[]
): Promise<AvailabilityResult> => {
  const { data, error } = await supabase
    .from('party_hall_bookings')
    .select('time_slots')
    .eq('hall_id', hallId)
    .eq('booking_date', bookingDate)
    .in('approval_status', ['pending', 'approved']);

  if (error) throw error;

  // Check if all requested time slots are available
  const bookedSlots = new Set<TimeSlot>();
  data?.forEach((booking: any) => {
    booking.time_slots?.forEach((slot: TimeSlot) => bookedSlots.add(slot));
  });

  const hasConflict = timeSlots.some(slot => bookedSlots.has(slot));

  if (hasConflict) {
    const allHalls = await fetchPartyHalls();
    const alternativeHalls: PartyHall[] = [];

    for (const hall of allHalls) {
      if (hall.id !== hallId) {
        const { data: existingBookings } = await supabase
          .from('party_hall_bookings')
          .select('time_slots')
          .eq('hall_id', hall.id)
          .eq('booking_date', bookingDate)
          .in('approval_status', ['pending', 'approved']);

        const hallBookedSlots = new Set<TimeSlot>();
        existingBookings?.forEach((booking: any) => {
          booking.time_slots?.forEach((slot: TimeSlot) => hallBookedSlots.add(slot));
        });

        const hallHasConflict = timeSlots.some(slot => hallBookedSlots.has(slot));
        if (!hallHasConflict) {
          alternativeHalls.push(hall);
        }
      }
    }

    return { isAvailable: false, alternativeHalls };
  }

  return { isAvailable: true };
};

export const getBookedSlots = async (
  hallId: string,
  bookingDate: string
): Promise<TimeSlot[]> => {
  const { data, error } = await supabase
    .from('party_hall_bookings')
    .select('time_slots')
    .eq('hall_id', hallId)
    .eq('booking_date', bookingDate)
    .in('approval_status', ['pending', 'approved']);

  if (error) throw error;

  const bookedSlots = new Set<TimeSlot>();
  data?.forEach((booking: any) => {
    booking.time_slots?.forEach((slot: TimeSlot) => bookedSlots.add(slot));
  });

  return Array.from(bookedSlots);
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

// Admin functions
export const fetchAllPartyHalls = async (): Promise<PartyHall[]> => {
  const { data, error } = await supabase
    .from('party_halls')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return data || [];
};

export const createPartyHall = async (hallData: Omit<PartyHall, 'id'>, adminId: string) => {
  const { data, error } = await supabase.rpc('admin_create_party_hall', {
    p_admin_id: adminId,
    p_name: hallData.name,
    p_location: hallData.location,
    p_phone: hallData.phone,
    p_maps_url: hallData.maps_url,
    p_capacity_min: hallData.capacity_min,
    p_capacity_max: hallData.capacity_max,
    p_is_active: hallData.is_active,
    p_display_order: hallData.display_order,
  });

  if (error) throw error;
  return data;
};

export const updatePartyHall = async (id: string, hallData: Partial<PartyHall>, adminId: string) => {
  const { data, error } = await supabase.rpc('admin_update_party_hall', {
    p_admin_id: adminId,
    p_hall_id: id,
    p_name: hallData.name,
    p_location: hallData.location,
    p_phone: hallData.phone,
    p_maps_url: hallData.maps_url,
    p_capacity_min: hallData.capacity_min,
    p_capacity_max: hallData.capacity_max,
    p_is_active: hallData.is_active,
    p_display_order: hallData.display_order,
  });

  if (error) throw error;
  return data;
};

export const deletePartyHall = async (id: string, adminId: string) => {
  const { error } = await supabase.rpc('admin_delete_party_hall', {
    p_admin_id: adminId,
    p_hall_id: id,
  });

  if (error) throw error;
};
