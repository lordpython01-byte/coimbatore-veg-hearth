import { Card } from "@/components/ui/card";
import coffeeImage from "@/assets/coffee.jpg";
import pongalImage from "@/assets/pongal.jpg";
import vadaImage from "@/assets/vada.jpg";
import idliImage from "@/assets/idli.jpg";
import dosaImage from "@/assets/dosa.jpg";

const Menu = () => {
  const specials = [
    {
      name: "Filter Coffee",
      image: coffeeImage,
      description: "Traditional South Indian filter coffee served in steel tumbler and davara",
      price: "₹40",
    },
    {
      name: "Ven Pongal",
      image: pongalImage,
      description: "Savory rice and lentil dish with ghee, cashews, and pepper",
      price: "₹80",
    },
    {
      name: "Medu Vada",
      image: vadaImage,
      description: "Crispy golden lentil donuts served with chutneys and sambar",
      price: "₹60",
    },
    {
      name: "Idli",
      image: idliImage,
      description: "Soft steamed rice cakes with coconut chutney and sambar",
      price: "₹50",
    },
    {
      name: "Masala Dosa",
      image: dosaImage,
      description: "Crispy rice crepe with spiced potato filling",
      price: "₹90",
    },
  ];

  return (
    <section id="menu" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Today's Special
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Authentic Tamil Nadu delicacies prepared fresh daily
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specials.map((item, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-border"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="text-gold font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;
