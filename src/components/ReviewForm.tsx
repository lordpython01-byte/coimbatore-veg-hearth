import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReviewForm = () => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your review!",
      description: "Your feedback helps us serve you better.",
    });
    // Reset form
    setRating(0);
    (e.target as HTMLFormElement).reset();
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
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input required placeholder="Enter your name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input required type="email" placeholder="Enter your email" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input required placeholder="Your city" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <Textarea
                  required
                  placeholder="Tell us about your experience..."
                  rows={5}
                />
              </div>

              <Button type="submit" size="lg" className="w-full border-2 border-primary">
                Submit Review
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;
