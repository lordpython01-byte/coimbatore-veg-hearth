import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const AdminVideoManager = () => {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRole, setReviewerRole] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('food_review_videos')
        .insert({
          reviewer_name: reviewerName,
          reviewer_role: reviewerRole,
          video_url: videoUrl,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Video review added successfully",
      });

      setReviewerName("");
      setReviewerRole("");
      setVideoUrl("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add video review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add Video Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Reviewer Name (Tamil)</Label>
            <Input
              id="name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="முருகன்"
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Reviewer Role</Label>
            <Input
              id="role"
              value={reviewerRole}
              onChange={(e) => setReviewerRole(e.target.value)}
              placeholder="Food Vlogger"
              required
            />
          </div>
          <div>
            <Label htmlFor="url">Video URL (YouTube Shorts or Instagram Reels)</Label>
            <Input
              id="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/shorts/..."
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding..." : "Add Video Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
