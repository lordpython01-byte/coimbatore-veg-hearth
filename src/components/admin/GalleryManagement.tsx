import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  title: string;
  display_order: number;
  span_class: string;
  is_active: boolean;
}

const GalleryManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      toast({ title: 'Success', description: 'Image deleted' });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gallery Images</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Gallery Image</DialogTitle>
            </DialogHeader>
            <GalleryForm item={editingItem} onSuccess={() => { setIsDialogOpen(false); setEditingItem(null); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="relative aspect-video mb-3 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold truncate">{image.title || image.alt_text}</h3>
                  <p className="text-sm text-muted-foreground truncate">{image.alt_text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${image.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {image.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-muted-foreground">Order: {image.display_order}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => { setEditingItem(image); setIsDialogOpen(true); }}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(image.id)}>
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

const GalleryForm = ({ item, onSuccess }: { item: GalleryImage | null; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    image_url: item?.image_url || '',
    alt_text: item?.alt_text || '',
    title: item?.title || '',
    display_order: item?.display_order || 0,
    span_class: item?.span_class || 'md:col-span-1 md:row-span-1',
    is_active: item?.is_active ?? true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (item) {
        const { error } = await supabase.from('gallery_images').update(data).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('gallery_images').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images-admin'] });
      toast({ title: 'Success', description: `Image ${item ? 'updated' : 'added'}` });
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
      <div>
        <Label>Image URL</Label>
        <Input
          placeholder="https://example.com/image.jpg"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">Enter a full web URL (e.g., from Unsplash, Pexels, or your CDN)</p>
      </div>

      {formData.image_url && (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <img
            src={formData.image_url}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
            }}
          />
        </div>
      )}

      <div>
        <Label>Alt Text</Label>
        <Input
          placeholder="Description of the image"
          value={formData.alt_text}
          onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Title (Optional)</Label>
        <Input
          placeholder="Image title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Display Order</Label>
          <Input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Grid Span</Label>
          <Select value={formData.span_class} onValueChange={(value) => setFormData({ ...formData, span_class: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="md:col-span-1 md:row-span-1">Small (1x1)</SelectItem>
              <SelectItem value="md:col-span-2 md:row-span-1">Wide (2x1)</SelectItem>
              <SelectItem value="md:col-span-1 md:row-span-2">Tall (1x2)</SelectItem>
              <SelectItem value="md:col-span-2 md:row-span-2">Large (2x2)</SelectItem>
            </SelectContent>
          </Select>
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

export default GalleryManagement;
