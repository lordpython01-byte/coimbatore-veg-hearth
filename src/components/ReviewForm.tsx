import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const ReviewForm = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
    review: ''
  });

  const submitReview = useMutation({
    mutationFn: async (data: typeof formData & { rating: number }) => {
      const { error } = await supabase.from('customer_reviews').insert({
        customer_name: data.name,
        email: data.email,
        location: data.location,
        phone: data.phone || null,
        rating: data.rating,
        review_text: data.review,
        is_approved: false
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Thank you for your review!",
        description: "Your review has been submitted and will be visible after approval.",
      });
      setRating(0);
      setFormData({ name: '', email: '', location: '', phone: '', review: '' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Rating is required to submit a review.",
        variant: "destructive"
      });
      return;
    }
    submitReview.mutate({ ...formData, rating });
  };

  return (
    <section id="review-form" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-accent font-semibold text-sm tracking-wider uppercase">
                Share Your Experience
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
              Write a Review
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Share your experience with us
            </p>
          </div>

          <Card className="p-8 border-2 border-primary/20 shadow-xl bg-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <Input
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <Input
                  required
                  placeholder="Your city"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-gold text-gold"
                            : "text-border"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {rating === 5 ? "Excellent!" : rating === 4 ? "Very Good!" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review *</label>
                <Textarea
                  required
                  placeholder="Tell us about your experience..."
                  rows={5}
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full border-2 border-primary"
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
