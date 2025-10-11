import { Card } from "@/components/ui/card";
import { Utensils, Users, Heart } from "lucide-react";

const Catering = () => {
  const services = [
    {
      icon: <Utensils className="w-12 h-12 text-gold" />,
      title: "Fine Dining",
      description:
        "Experience authentic Tamil Nadu cuisine in our elegant restaurant setting with traditional flavors and modern presentation.",
    },
    {
      icon: <Users className="w-12 h-12 text-gold" />,
      title: "Catering Services",
      description:
        "From intimate gatherings to grand celebrations, we bring authentic vegetarian delicacies to your events with impeccable service.",
    },
    {
      icon: <Heart className="w-12 h-12 text-gold" />,
      title: "Pure & Authentic",
      description:
        "100% pure vegetarian cuisine prepared with the finest ingredients, maintaining traditional recipes passed down through generations.",
    },
  ];

  return (
    <section id="catering" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Restaurant & Catering
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Serving authentic Tamil Nadu vegetarian cuisine with passion and
            tradition since our inception
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 text-center hover:shadow-xl transition-shadow border-2 border-border"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catering;
