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
import { Plus, Edit, Trash2, Calendar, Users, Phone, Mail, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PartyHall {
  id: string;
  name: string;
  location: string;
  phone: string;
}

interface Booking {
  id: string;
  hall_id: string;
  hall_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  booking_date: string;
  purpose: string;
  event_type: string;
  guest_count: number;
  status: 'booked' | 'available' | 'cancelled';
  approval_status: 'pending' | 'approved' | 'rejected';
  admin_notes: string;
  approved_at: string;
  created_at: string;
  party_halls?: PartyHall;
}

const BookingManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Booking | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['party-hall-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('party_hall_bookings')
        .select(`
          *,
          party_halls (
            id,
            name,
            location,
            phone
          )
        `)
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

  const approvalMutation = useMutation({
    mutationFn: async ({
      id,
      approval_status,
      admin_notes,
    }: {
      id: string;
      approval_status: 'approved' | 'rejected';
      admin_notes?: string;
    }) => {
      const { error } = await supabase
        .from('party_hall_bookings')
        .update({
          approval_status,
          admin_notes: admin_notes || null,
          approved_at: approval_status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['party-hall-bookings'] });
      toast({
        title: 'Success',
        description: `Booking ${variables.approval_status === 'approved' ? 'approved' : 'rejected'}`,
      });
      setApprovalDialogOpen(false);
      setSelectedBooking(null);
      setAdminNotes('');
    },
  });

  const handleApprove = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes('');
    setApprovalDialogOpen(true);
  };

  const handleReject = (booking: Booking) => {
    setSelectedBooking(booking);
    setAdminNotes('');
    setApprovalDialogOpen(true);
  };

  const confirmApproval = (status: 'approved' | 'rejected') => {
    if (selectedBooking) {
      approvalMutation.mutate({
        id: selectedBooking.id,
        approval_status: status,
        admin_notes: adminNotes,
      });
    }
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const pendingBookings = bookings.filter((b) => b.approval_status === 'pending');
  const approvedBookings = bookings.filter((b) => b.approval_status === 'approved');
  const rejectedBookings = bookings.filter((b) => b.approval_status === 'rejected');

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card key={booking.id} className="border-2">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-lg">
                {booking.party_halls?.name || booking.hall_name}
              </h3>
              <Badge className={`${getApprovalStatusColor(booking.approval_status)} border`}>
                {booking.approval_status}
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
                {booking.party_halls && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {booking.party_halls.location}
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
                  {booking.guest_count || 0} guests
                </p>
                {booking.purpose && (
                  <p className="text-muted-foreground mt-1">
                    <strong>Purpose:</strong> {booking.purpose}
                  </p>
                )}
              </div>
            </div>
            {booking.admin_notes && (
              <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded italic">
                Admin Notes: {booking.admin_notes}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 ml-4">
            {booking.approval_status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(booking)}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(booking)}
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingItem(booking);
                setIsDialogOpen(true);
              }}
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => deleteMutation.mutate(booking.id)}
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Party Hall Bookings</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit' : 'Add'} Booking</DialogTitle>
              </DialogHeader>
              <BookingForm
                item={editingItem}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setEditingItem(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingBookings.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-2 px-1.5 py-0.5 text-xs"
                    >
                      {pendingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedBookings.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending bookings
                  </p>
                ) : (
                  pendingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No approved bookings
                  </p>
                ) : (
                  approvedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedBookings.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No rejected bookings
                  </p>
                ) : (
                  rejectedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Approval</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p>
                  <strong>Hall:</strong>{' '}
                  {selectedBooking.party_halls?.name || selectedBooking.hall_name}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedBooking.customer_name}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(selectedBooking.booking_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Purpose:</strong> {selectedBooking.purpose}
                </p>
              </div>
              <div>
                <Label htmlFor="admin_notes">Admin Notes (Optional)</Label>
                <Textarea
                  id="admin_notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this booking..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => confirmApproval('approved')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={approvalMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => confirmApproval('rejected')}
                  variant="destructive"
                  className="flex-1"
                  disabled={approvalMutation.isPending}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const BookingForm = ({
  item,
  onSuccess,
}: {
  item: Booking | null;
  onSuccess: () => void;
}) => {
  const [formData, setFormData] = useState({
    hall_id: item?.hall_id || '',
    customer_name: item?.customer_name || '',
    customer_phone: item?.customer_phone || '',
    customer_email: item?.customer_email || '',
    booking_date: item?.booking_date || new Date().toISOString().split('T')[0],
    purpose: item?.purpose || '',
    guest_count: item?.guest_count || 50,
    approval_status: item?.approval_status || 'pending',
    admin_notes: item?.admin_notes || '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: partyHalls = [] } = useQuery({
    queryKey: ['party-halls-for-booking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('party_halls')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (item) {
        const { error } = await supabase
          .from('party_hall_bookings')
          .update(data)
          .eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('party_hall_bookings').insert({
          ...data,
          status: 'booked',
        });
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label>Hall</Label>
        <Select
          value={formData.hall_id}
          onValueChange={(value) => setFormData({ ...formData, hall_id: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a hall" />
          </SelectTrigger>
          <SelectContent>
            {partyHalls.map((hall: PartyHall) => (
              <SelectItem key={hall.id} value={hall.id}>
                {hall.name} ({hall.location})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Customer Name</Label>
          <Input
            value={formData.customer_name}
            onChange={(e) =>
              setFormData({ ...formData, customer_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={formData.customer_phone}
            onChange={(e) =>
              setFormData({ ...formData, customer_phone: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.customer_email}
          onChange={(e) =>
            setFormData({ ...formData, customer_email: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Booking Date</Label>
          <Input
            type="date"
            value={formData.booking_date}
            onChange={(e) =>
              setFormData({ ...formData, booking_date: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label>Guest Count</Label>
          <Input
            type="number"
            value={formData.guest_count}
            onChange={(e) =>
              setFormData({ ...formData, guest_count: parseInt(e.target.value) })
            }
            required
          />
        </div>
      </div>
      <div>
        <Label>Purpose</Label>
        <Textarea
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          placeholder="Purpose of booking"
        />
      </div>
      <div>
        <Label>Approval Status</Label>
        <Select
          value={formData.approval_status}
          onValueChange={(value) =>
            setFormData({ ...formData, approval_status: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Admin Notes</Label>
        <Textarea
          value={formData.admin_notes}
          onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default BookingManagement;
