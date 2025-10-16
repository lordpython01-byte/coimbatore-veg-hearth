import { useState, useEffect, useRef } from "react";
import dishIdli from "@/assets/dish-idli.jpg";
import dishMasalaDosa from "@/assets/dish-masala-dosa.jpg";
import dishVada from "@/assets/dish-vada.jpg";
import dishPongal from "@/assets/dish-pongal.jpg";
import dishSambarRice from "@/assets/dish-sambar-rice.jpg";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const KolamPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="kolam" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <circle cx="35" cy="35" r="1.5" fill="currentColor" />
        <path d="M 5 5 L 20 20 L 5 35 L 20 20 L 35 5" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kolam)" />
  </svg>
);

const KolamCorner = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L20 0 L20 2 L15 2 L15 7 L13 7 L13 4 L10 4 L10 10 L7 10 L7 7 L4 7 L4 13 L2 13 L2 10 L0 10 Z" fill="currentColor"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="8" cy="16" r="1" fill="currentColor"/>
    <circle cx="16" cy="8" r="1" fill="currentColor"/>
  </svg>
);

const Menu = () => {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const dishes = [
    { 
      image: dishIdli, 
      title: "Soft Idli", 
      description: "Fluffy steamed rice cakes served with coconut chutney and sambar",
      price: "₹40"
    },
    { 
      image: dishMasalaDosa, 
      title: "Masala Dosa", 
      description: "Crispy golden dosa filled with spiced potato masala",
      price: "₹60"
    },
    { 
      image: dishVada, 
      title: "Medu Vada", 
      description: "Crispy fried lentil donuts, a perfect tea-time snack",
      price: "₹45"
    },
    { 
      image: dishPongal, 
      title: "Ven Pongal", 
      description: "Comforting rice and lentil porridge with ghee and spices",
      price: "₹50"
    },
    { 
      image: dishSambarRice, 
      title: "Sambar Rice", 
      description: "Wholesome rice mixed with flavorful sambar and vegetables",
      price: "₹55"
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="menu" className="py-20 bg-background relative overflow-hidden">
      {/* Background Kolam Pattern */}
      <div className="absolute inset-0 opacity-3">
        <KolamPattern />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">Delicious Offerings</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary animate-fade-in">
            Our Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Explore our authentic Tamil Nadu delicacies
          </p>
          
          {/* Decorative border */}
          <div className="flex justify-center items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rotate-45 bg-primary opacity-60"></div>
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          
          {/* Decorative bottom border */}
          <div className="flex justify-center items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent"></div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent"></div>
          </div>
        </div>

        <div className="space-y-8 md:space-y-12 max-w-4xl mx-auto">
          {dishes.map((dish, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`transition-all duration-700 ${
                  visibleCards[index]
                    ? 'opacity-100 translate-x-0'
                    : `opacity-0 ${isLeft ? '-translate-x-20' : 'translate-x-20'}`
                }`}
              >
                {/* Traditional frame wrapper */}
                <div className="relative p-4 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-lg">
                  {/* Kolam corner decorations */}
                  <KolamCorner className="absolute top-1 left-1 text-primary" />
                  <KolamCorner className="absolute top-1 right-1 text-primary transform rotate-90" />
                  <KolamCorner className="absolute bottom-1 left-1 text-accent transform -rotate-90" />
                  <KolamCorner className="absolute bottom-1 right-1 text-accent transform rotate-180" />

                  {/* Decorative border lines */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-30"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-30"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent to-transparent opacity-30"></div>

                  <Card className="group relative overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 bg-card/95 backdrop-blur-sm">
                    <CardContent className="p-0 relative">
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto">
                          <div className="absolute inset-0 z-10 pointer-events-none">
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-brown-dark/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-brown-dark/80 to-transparent"></div>
                          </div>

                          <img
                            src={dish.image}
                            alt={dish.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        {/* Content Section */}
                        <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-card via-card to-accent/5">
                          <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full border border-accent/30">
                              Pure Veg
                            </span>
                          </div>
                          
                          <h3 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
                            {dish.title}
                          </h3>
                          
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {dish.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                            <span className="text-2xl font-bold text-primary">
                              {dish.price}
                            </span>
                            <div className="flex gap-2">
                              {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-2 h-2 rotate-45 bg-accent/60"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button
            size="lg"
            onClick={() => navigate('/full-menu')}
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Full Menu
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Discover all our authentic Tamil Nadu delicacies
          </p>
        </div>
      </div>
    </section>
  );
};

export default Menu;
