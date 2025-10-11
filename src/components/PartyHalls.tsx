import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import partyHallImage from "@/assets/party-hall.jpg";

const PartyHalls = () => {
  const features = [
    "Spacious halls accommodating 50-500 guests",
    "Traditional Tamil Nadu decor with modern amenities",
    "Customizable menu options for all occasions",
    "Professional service staff",
    "Audio-visual equipment available",
    "Ample parking space",
  ];

  return (
    <section id="party-halls" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Premium Party Halls
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrate your special moments in our elegant party halls
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={partyHallImage}
              alt="Elegant party hall"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>

          <Card className="p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-semibold mb-6">
              Perfect Venue for Every Occasion
            </h3>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gold mr-3 text-xl">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="w-full border-2 border-primary"
            >
              Book Your Event
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartyHalls;
