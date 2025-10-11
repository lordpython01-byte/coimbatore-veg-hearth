import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const reviews = [
    {
      name: "Rajesh Kumar",
      rating: 5,
      review:
        "The most authentic Tamil Nadu cuisine I've tasted outside my grandmother's kitchen. The pongal is absolutely divine!",
      location: "Coimbatore",
    },
    {
      name: "Priya Shankar",
      rating: 5,
      review:
        "We hosted our daughter's wedding reception here. The food, service, and ambiance were all exceptional. Highly recommended!",
      location: "Chennai",
    },
    {
      name: "Venkatesh Iyer",
      rating: 5,
      review:
        "Pure vegetarian paradise indeed! Every dish is prepared with love and tradition. The filter coffee is a must-try.",
      location: "Coimbatore",
    },
    {
      name: "Lakshmi Ramachandran",
      rating: 5,
      review:
        "The party hall is beautifully decorated and spacious. Our corporate event was a huge success thanks to their impeccable catering.",
      location: "Bangalore",
    },
    {
      name: "Arun Krishnan",
      rating: 5,
      review:
        "Best idli and dosa in Coimbatore! The chutneys are freshly made and the sambar is perfectly spiced. A true gem.",
      location: "Coimbatore",
    },
    {
      name: "Meena Sundaram",
      rating: 5,
      review:
        "Family-friendly atmosphere with authentic taste. The staff is courteous and the food quality is consistently excellent.",
      location: "Madurai",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            What Our Guests Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Read reviews from our satisfied customers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="p-6 border-2 border-border">
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">"{review.review}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
