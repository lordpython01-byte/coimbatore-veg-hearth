import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Trash2, Star } from 'lucide-react';

interface Review {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
}

const ReviewManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['customer-reviews-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ is_approved: approved })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-reviews-admin'] });
      toast({ title: 'Success', description: 'Review updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('customer_reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-reviews-admin'] });
      toast({ title: 'Success', description: 'Review deleted' });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{review.customer_name}</h3>
                        <div className="flex items-center">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <Badge variant={review.is_approved ? 'default' : 'secondary'}>
                          {review.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        {review.email && (
                          <div>
                            <span className="font-medium">Email:</span> {review.email}
                          </div>
                        )}
                        {review.phone && (
                          <div>
                            <span className="font-medium">Phone:</span> {review.phone}
                          </div>
                        )}
                        {review.location && (
                          <div>
                            <span className="font-medium">Location:</span> {review.location}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(review.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3 mt-2">
                        "{review.review_text}"
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {!review.is_approved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveMutation.mutate({ id: review.id, approved: true })}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveMutation.mutate({ id: review.id, approved: false })}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Unapprove
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default ReviewManagement;
