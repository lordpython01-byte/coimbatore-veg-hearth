import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar, Users, Phone, Mail } from 'lucide-react';

interface Booking {
  id: string;
  hall_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  booking_date: string;
  event_type: string;
  guest_count: number;
  status: 'booked' | 'available' | 'cancelled';
  notes: string;
  created_at: string;
}

const BookingManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Booking | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['party-hall-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('party_hall_bookings')
        .select('*')
        .order('booking_date', { ascending: true });
      if (error) throw error;
      return data as Booking[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('party_hall_bookings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['party-hall-bookings'] });
      toast({ title: 'Success', description: 'Booking deleted' });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('party_hall_bookings')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['party-hall-bookings'] });
      toast({ title: 'Success', description: 'Booking status updated' });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-blue-100 text-blue-700';
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Party Hall Bookings</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Booking</DialogTitle>
            </DialogHeader>
            <BookingForm item={editingItem} onSuccess={() => { setIsDialogOpen(false); setEditingItem(null); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{booking.hall_name}</h3>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {booking.customer_phone}
                          </p>
                          {booking.customer_email && (
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {booking.customer_email}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.booking_date).toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3" />
                            {booking.guest_count} guests
                          </p>
                          {booking.event_type && (
                            <p className="text-muted-foreground mt-1">Event: {booking.event_type}</p>
                          )}
                        </div>
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          Notes: {booking.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: booking.id, status: value })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={() => { setEditingItem(booking); setIsDialogOpen(true); }}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(booking.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const BookingForm = ({ item, onSuccess }: { item: Booking | null; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    hall_name: item?.hall_name || '',
    customer_name: item?.customer_name || '',
    customer_phone: item?.customer_phone || '',
    customer_email: item?.customer_email || '',
    booking_date: item?.booking_date || new Date().toISOString().split('T')[0],
    event_type: item?.event_type || '',
    guest_count: item?.guest_count || 50,
    status: item?.status || 'booked',
    notes: item?.notes || '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (item) {
        const { error } = await supabase.from('party_hall_bookings').update(data).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('party_hall_bookings').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['party-hall-bookings'] });
      toast({ title: 'Success', description: `Booking ${item ? 'updated' : 'added'}` });
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
      <div>
        <Label>Hall Name</Label>
        <Input value={formData.hall_name} onChange={(e) => setFormData({ ...formData, hall_name: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Customer Name</Label>
          <Input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} required />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={formData.customer_email} onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Booking Date</Label>
          <Input type="date" value={formData.booking_date} onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })} required />
        </div>
        <div>
          <Label>Guest Count</Label>
          <Input type="number" value={formData.guest_count} onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) })} required />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Event Type</Label>
        <Input value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default BookingManagement;
