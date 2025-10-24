import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Upload, Copy, Play, Video as VideoIcon } from 'lucide-react';
import { validateVideoFile, getVideoMetadata, formatFileSize, formatDuration, copyToClipboard, downloadVideoFile, getVideoFileName, getVideoPath } from '@/lib/videoUploadService';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoReview {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  video_url: string;
  thumbnail_url: string;
  display_order: number;
  is_active: boolean;
  video_type?: 'local' | 'youtube';
  file_size?: number;
  video_duration?: number;
  original_filename?: string;
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
                  {video.video_type === 'local' && video.video_url && (
                    <div className="mb-3 aspect-video bg-black rounded-md overflow-hidden">
                      <video src={video.video_url} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{video.reviewer_name}</h3>
                      <p className="text-sm text-muted-foreground">{video.reviewer_role}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${video.video_type === 'local' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {video.video_type === 'local' ? 'Local' : 'YouTube'}
                    </span>
                  </div>
                  <div className="bg-muted/50 p-2 rounded mt-2 mb-2">
                    <p className="text-xs text-muted-foreground truncate">{video.video_url}</p>
                    <button
                      onClick={() => {
                        copyToClipboard(video.video_url);
                        toast({ title: 'Copied!', description: 'Video path copied to clipboard' });
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 mt-1 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy Path
                    </button>
                  </div>
                  {video.file_size && (
                    <p className="text-xs text-muted-foreground">Size: {formatFileSize(video.file_size)}</p>
                  )}
                  {video.video_duration && (
                    <p className="text-xs text-muted-foreground">Duration: {formatDuration(video.video_duration)}</p>
                  )}
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
    video_type: item?.video_type || 'youtube',
    file_size: item?.file_size || 0,
    video_duration: item?.video_duration || 0,
    original_filename: item?.original_filename || '',
  });
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>(item?.video_type === 'local' ? 'upload' : 'url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<{ duration: number; size: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateVideoFile(file);
    if (validationError) {
      toast({ title: 'Error', description: validationError, variant: 'destructive' });
      return;
    }

    setSelectedFile(file);
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);

    setFormData({
      ...formData,
      original_filename: file.name,
      file_size: file.size,
      video_duration: 0,
    });

    setVideoMetadata({ duration: 0, size: file.size });

    try {
      const metadata = await getVideoMetadata(file);
      setVideoMetadata({ duration: metadata.duration, size: file.size });
      setFormData((prev) => ({
        ...prev,
        video_duration: metadata.duration,
      }));
    } catch (error) {
      console.warn('Could not extract video metadata, continuing without duration info');
    }
  };

  const prepareVideoFile = async (): Promise<string> => {
    if (!selectedFile) throw new Error('No file selected');

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(30);
      const filename = downloadVideoFile(selectedFile);

      setUploadProgress(60);
      const videoPath = getVideoPath(filename);

      setUploadProgress(100);

      toast({
        title: 'Manual Upload Required',
        description: `Please upload "${filename}" to your server's /public/assets/videos/ folder via cPanel File Manager`,
        duration: 10000,
      });

      return videoPath;
    } catch (error) {
      console.error('Prepare error:', error);
      throw error instanceof Error ? error : new Error('Failed to prepare video file');
    } finally {
      setIsUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let finalData = { ...data };

      if (uploadMethod === 'upload' && selectedFile) {
        try {
          const videoPath = await prepareVideoFile();
          finalData.video_url = videoPath;
          finalData.video_type = 'local';
        } catch (error) {
          throw new Error('Failed to prepare video file');
        }
      } else {
        finalData.video_type = 'youtube';
      }

      if (item) {
        const { error } = await supabase.from('food_review_videos').update(finalData).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('food_review_videos').insert(finalData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-review-videos-admin'] });
      toast({ title: 'Success', description: `Video ${item ? 'updated' : 'added'} successfully` });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
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

      <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'upload' | 'url')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Video
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <VideoIcon className="w-4 h-4" />
            YouTube URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div>
            <Label>Upload Video File</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedFile ? selectedFile.name : 'Choose Video File'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Supported: MP4, WebM, OGG (Max 100MB)</p>
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video bg-black rounded-md overflow-hidden">
                <video src={previewUrl} controls className="w-full h-full object-cover" />
              </div>
              {videoMetadata && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Size: {formatFileSize(videoMetadata.size)}</p>
                  <p>Duration: {formatDuration(videoMetadata.duration)}</p>
                </div>
              )}
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Label>Uploading...</Label>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}%</p>
            </div>
          )}

          {formData.video_url && uploadMethod === 'upload' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-sm font-semibold text-green-800 mb-1">Upload Successful!</p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-green-700 truncate flex-1">{formData.video_url}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    copyToClipboard(formData.video_url);
                    toast({ title: 'Copied!', description: 'Video path copied to clipboard' });
                  }}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div>
            <Label>Video URL</Label>
            <Input
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              required={uploadMethod === 'url'}
              placeholder="https://youtube.com/shorts/..."
            />
            <p className="text-xs text-muted-foreground mt-1">YouTube Shorts URL (e.g., https://youtube.com/shorts/wMXxGAOZkdY)</p>
          </div>
        </TabsContent>
      </Tabs>

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
      <Button type="submit" className="w-full" disabled={mutation.isPending || isUploading}>
        {mutation.isPending ? 'Saving...' : 'Save Video Review'}
      </Button>
    </form>
  );
};

export default VideoManagement;
