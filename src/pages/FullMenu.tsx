import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import dishIdli from "@/assets/dish-idli.jpg";
import dishMasalaDosa from "@/assets/dish-masala-dosa.jpg";
import dishVada from "@/assets/dish-vada.jpg";
import dishPongal from "@/assets/dish-pongal.jpg";
import dishSambarRice from "@/assets/dish-sambar-rice.jpg";

const KolamPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="kolam-full" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
        <circle cx="35" cy="35" r="1.5" fill="currentColor" />
        <path d="M 5 5 L 20 20 L 5 35 L 20 20 L 35 5" stroke="currentColor" strokeWidth="0.5" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#kolam-full)" />
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

const FullMenu = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allDishes = [
    { 
      image: dishIdli, 
      title: "Soft Idli", 
      description: "Fluffy steamed rice cakes served with coconut chutney and sambar",
      price: "₹40",
      category: "Breakfast"
    },
    { 
      image: dishMasalaDosa, 
      title: "Masala Dosa", 
      description: "Crispy golden dosa filled with spiced potato masala",
      price: "₹60",
      category: "Breakfast"
    },
    { 
      image: dishVada, 
      title: "Medu Vada", 
      description: "Crispy fried lentil donuts, a perfect tea-time snack",
      price: "₹45",
      category: "Snacks"
    },
    { 
      image: dishPongal, 
      title: "Ven Pongal", 
      description: "Comforting rice and lentil porridge with ghee and spices",
      price: "₹50",
      category: "Breakfast"
    },
    { 
      image: dishSambarRice, 
      title: "Sambar Rice", 
      description: "Wholesome rice mixed with flavorful sambar and vegetables",
      price: "₹55",
      category: "Main Course"
    },
  ];

  const filteredDishes = allDishes.filter(dish =>
    dish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  }, [filteredDishes.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Menu Content */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background Kolam Pattern */}
        <div className="absolute inset-0 opacity-3">
          <KolamPattern />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-accent font-semibold text-sm tracking-wider uppercase">Complete Menu</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary animate-fade-in">
              Full Menu
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse our complete selection of authentic Tamil Nadu cuisine
            </p>
            
            {/* Decorative border */}
            <div className="flex justify-center items-center gap-3 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rotate-45 bg-primary opacity-60"></div>
                ))}
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search dishes, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-6 text-lg border-2 border-primary/20 focus:border-primary rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 md:space-y-12 max-w-4xl mx-auto">
            {filteredDishes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No dishes found matching your search.</p>
              </div>
            ) : (
              filteredDishes.map((dish, index) => {
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
                              <div className="mb-4 flex gap-2">
                                <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full border border-accent/30">
                                  Pure Veg
                                </span>
                                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/30">
                                  {dish.category}
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
              })
            )}
          </div>

          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-4 px-6 py-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
              <p className="text-muted-foreground">
                For orders and reservations, please contact us
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="tel:+1234567890" className="text-primary hover:text-accent transition-colors font-semibold">
                  📞 +123 456 7890
                </a>
                <span className="text-border">|</span>
                <a href="mailto:info@restaurant.com" className="text-primary hover:text-accent transition-colors font-semibold">
                  ✉️ info@restaurant.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FullMenu;
