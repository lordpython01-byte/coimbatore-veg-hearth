import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface VideoReview {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  video_url: string;
  thumbnail_url: string;
  display_order: number;
  is_active: boolean;
}

const VideoManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VideoReview | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['food-review-videos-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_review_videos')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as VideoReview[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('food_review_videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-review-videos-admin'] });
      toast({ title: 'Success', description: 'Video deleted' });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Video Reviews</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Video Review</DialogTitle>
            </DialogHeader>
            <VideoForm item={editingItem} onSuccess={() => { setIsDialogOpen(false); setEditingItem(null); }} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{video.reviewer_name}</h3>
                  <p className="text-sm text-muted-foreground">{video.reviewer_role}</p>
                  <p className="text-xs text-muted-foreground mt-2 truncate">{video.video_url}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${video.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {video.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => { setEditingItem(video); setIsDialogOpen(true); }}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(video.id)}>
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

const VideoForm = ({ item, onSuccess }: { item: VideoReview | null; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    reviewer_name: item?.reviewer_name || '',
    reviewer_role: item?.reviewer_role || '',
    video_url: item?.video_url || '',
    thumbnail_url: item?.thumbnail_url || '',
    display_order: item?.display_order || 0,
    is_active: item?.is_active ?? true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    const youtubeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const videoId = shortsMatch?.[1] || watchMatch?.[1] || youtubeMatch?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?mute=1&controls=1`;
    }
    return null;
  };

  const isVideoFile = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (item) {
        const { error } = await supabase.from('food_review_videos').update(data).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('food_review_videos').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-review-videos-admin'] });
      toast({ title: 'Success', description: `Video ${item ? 'updated' : 'added'}` });
      onSuccess();
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="space-y-4">
      <div>
        <Label>Reviewer Name (Tamil)</Label>
        <Input value={formData.reviewer_name} onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })} required />
      </div>
      <div>
        <Label>Reviewer Role</Label>
        <Input value={formData.reviewer_role} onChange={(e) => setFormData({ ...formData, reviewer_role: e.target.value })} required />
      </div>
      <div>
        <Label>Video URL</Label>
        <Input value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} required placeholder="https://youtube.com/shorts/..." />
        <p className="text-xs text-muted-foreground mt-1">YouTube Shorts URL (e.g., https://youtube.com/shorts/wMXxGAOZkdY) or direct video file URL</p>
        {formData.video_url && (
          <p className="text-xs text-blue-600 mt-1">Video will be embedded on the website. Preview not available in admin panel.</p>
        )}
      </div>
      <div>
        <Label>Thumbnail URL (Optional)</Label>
        <Input value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Display Order</Label>
          <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} />
        </div>
        <div className="flex items-center space-x-2 pt-8">
          <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
          <Label>Active</Label>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default VideoManagement;
