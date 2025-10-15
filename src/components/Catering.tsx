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
    <section id="catering" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">Our Services</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Restaurant & Catering
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Serving authentic Tamil Nadu vegetarian cuisine with passion and tradition
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group p-8 text-center hover:shadow-2xl transition-all duration-300 border-2 border-border hover:border-primary bg-card hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catering;
