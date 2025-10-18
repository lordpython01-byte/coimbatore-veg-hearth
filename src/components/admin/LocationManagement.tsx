import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  map_url: string;
  is_active: boolean;
  opening_time: string;
  closing_time: string;
  display_order: number;
}

const LocationManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Location | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Location[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: 'Success', description: 'Location deleted' });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Locations</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Location</DialogTitle>
            </DialogHeader>
            <LocationForm item={editingItem} onSuccess={() => { setIsDialogOpen(false); setEditingItem(null); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {locations.map((location) => (
              <Card key={location.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{location.address}, {location.city}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {location.phone}
                    </p>
                    {location.email && (
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {location.email}
                      </p>
                    )}
                    <p className="text-sm">
                      Hours: {location.opening_time} - {location.closing_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs px-2 py-1 rounded ${location.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {location.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => { setEditingItem(location); setIsDialogOpen(true); }}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(location.id)}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
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

const LocationForm = ({ item, onSuccess }: { item: Location | null; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    address: item?.address || '',
    city: item?.city || '',
    phone: item?.phone || '',
    email: item?.email || '',
    map_url: item?.map_url || '',
    is_active: item?.is_active ?? true,
    opening_time: item?.opening_time || '09:00',
    closing_time: item?.closing_time || '22:00',
    display_order: item?.display_order || 0,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (item) {
        const { error } = await supabase.from('locations').update(data).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('locations').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      toast({ title: 'Success', description: `Location ${item ? 'updated' : 'added'}` });
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
      </div>
      <div>
        <Label>Address</Label>
        <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>City</Label>
          <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
        </div>
        <div>
          <Label>Phone</Label>
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      </div>
      <div>
        <Label>Map URL</Label>
        <Input value={formData.map_url} onChange={(e) => setFormData({ ...formData, map_url: e.target.value })} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Opening Time</Label>
          <Input type="time" value={formData.opening_time} onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })} />
        </div>
        <div>
          <Label>Closing Time</Label>
          <Input type="time" value={formData.closing_time} onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })} />
        </div>
        <div>
          <Label>Display Order</Label>
          <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
        <Label>Active</Label>
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default LocationManagement;
