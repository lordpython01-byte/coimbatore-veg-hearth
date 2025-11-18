import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, MapPin, Phone, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchAllPartyHalls,
  createPartyHall,
  updatePartyHall,
  deletePartyHall,
  PartyHall,
} from '@/lib/partyHallService';

type PartyHallFormData = Omit<PartyHall, 'id'>;

const PartyHallManagement = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<PartyHall | null>(null);
  const [formData, setFormData] = useState<PartyHallFormData>({
    name: '',
    location: '',
    phone: '',
    maps_url: '',
    capacity_min: 50,
    capacity_max: 500,
    is_active: true,
    display_order: 0,
  });

  const { data: partyHalls = [], isLoading } = useQuery({
    queryKey: ['admin-party-halls'],
    queryFn: fetchAllPartyHalls,
  });

  const createMutation = useMutation({
    mutationFn: createPartyHall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-party-halls'] });
      queryClient.invalidateQueries({ queryKey: ['party-halls'] });
      toast.success('Party hall created successfully');
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Failed to create party hall');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartyHall> }) =>
      updatePartyHall(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-party-halls'] });
      queryClient.invalidateQueries({ queryKey: ['party-halls'] });
      toast.success('Party hall updated successfully');
      handleCloseDialog();
    },
    onError: () => {
      toast.error('Failed to update party hall');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePartyHall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-party-halls'] });
      queryClient.invalidateQueries({ queryKey: ['party-halls'] });
      toast.success('Party hall deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete party hall');
    },
  });

  const handleOpenDialog = (hall?: PartyHall) => {
    if (hall) {
      setEditingHall(hall);
      setFormData({
        name: hall.name,
        location: hall.location,
        phone: hall.phone,
        maps_url: hall.maps_url,
        capacity_min: hall.capacity_min,
        capacity_max: hall.capacity_max,
        is_active: hall.is_active,
        display_order: hall.display_order,
      });
    } else {
      setEditingHall(null);
      setFormData({
        name: '',
        location: '',
        phone: '',
        maps_url: '',
        capacity_min: 50,
        capacity_max: 500,
        is_active: true,
        display_order: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingHall(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingHall) {
      updateMutation.mutate({ id: editingHall.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this party hall?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleInputChange = (field: keyof PartyHallFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Loading party halls...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Party Halls Management</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Party Hall
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partyHalls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No party halls found. Add your first party hall!
                  </TableCell>
                </TableRow>
              ) : (
                partyHalls.map((hall) => (
                  <TableRow key={hall.id}>
                    <TableCell className="font-medium">{hall.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {hall.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {hall.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {hall.capacity_min}-{hall.capacity_max}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          hall.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {hall.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>{hall.display_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(hall)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(hall.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingHall ? 'Edit Party Hall' : 'Add New Party Hall'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Hall Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Poondi, Chennai"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g., 9363009645"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maps_url">Google Maps URL</Label>
                  <Input
                    id="maps_url"
                    value={formData.maps_url}
                    onChange={(e) => handleInputChange('maps_url', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="capacity_min">Min Capacity *</Label>
                    <Input
                      id="capacity_min"
                      type="number"
                      value={formData.capacity_min}
                      onChange={(e) =>
                        handleInputChange('capacity_min', parseInt(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="capacity_max">Max Capacity *</Label>
                    <Input
                      id="capacity_max"
                      type="number"
                      value={formData.capacity_max}
                      onChange={(e) =>
                        handleInputChange('capacity_max', parseInt(e.target.value))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      handleInputChange('display_order', parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingHall
                    ? 'Update'
                    : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PartyHallManagement;
