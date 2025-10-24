import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

const Testimonials = () => {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['approved-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">
              Customer Love
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            What Our Guests Say
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Read reviews from our satisfied customers
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border-2 border-border hover:border-accent hover:shadow-2xl transition-all duration-300 bg-card">
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{review.review_text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">{review.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
