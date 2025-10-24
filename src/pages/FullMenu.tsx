import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import dishIdli from "@/assets/dish-idli.jpg";
import dishMasalaDosa from "@/assets/dish-masala-dosa.jpg";
import dishVada from "@/assets/dish-vada.jpg";
import dishPongal from "@/assets/dish-pongal.jpg";
import dishSambarRice from "@/assets/dish-sambar-rice.jpg";

interface Dish {
  image: string;
  title: string;
  description: string;
  category: string;
  rating?: number;
  cookingTime?: string;
}

const KolamPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
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

const FullMenu = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allDishes: Dish[] = [
    {
      image: dishIdli,
      title: "Soft Idli",
      description: "Fluffy steamed rice cakes served with coconut chutney and sambar",
      category: "Breakfast",
      rating: 4.8,
      cookingTime: "15 mins"
    },
    {
      image: dishMasalaDosa,
      title: "Masala Dosa",
      description: "Crispy golden dosa filled with spiced potato masala",
      category: "Breakfast",
      rating: 4.9,
      cookingTime: "20 mins"
    },
    {
      image: dishVada,
      title: "Medu Vada",
      description: "Crispy fried lentil donuts, a perfect tea-time snack",
      category: "Snacks",
      rating: 4.7,
      cookingTime: "18 mins"
    },
    {
      image: dishPongal,
      title: "Ven Pongal",
      description: "Comforting rice and lentil porridge with ghee and spices",
      category: "Breakfast",
      rating: 4.6,
      cookingTime: "25 mins"
    },
    {
      image: dishSambarRice,
      title: "Sambar Rice",
      description: "Wholesome rice mixed with flavorful sambar and vegetables",
      category: "Main Course",
      rating: 4.5,
      cookingTime: "22 mins"
    },
    {
      image: dishIdli,
      title: "Rava Idli",
      description: "Light and fluffy semolina idlis with cashews and ghee",
      category: "Breakfast",
      rating: 4.7,
      cookingTime: "18 mins"
    },
    {
      image: dishMasalaDosa,
      title: "Ghee Roast Dosa",
      description: "Paper-thin crispy dosa roasted with pure ghee",
      category: "Breakfast",
      rating: 4.9,
      cookingTime: "15 mins"
    },
    {
      image: dishVada,
      title: "Mysore Bonda",
      description: "Soft and fluffy fried fritters with a crispy exterior",
      category: "Snacks",
      rating: 4.6,
      cookingTime: "20 mins"
    },
    {
      image: dishPongal,
      title: "Sweet Pongal",
      description: "Traditional sweet made with rice, jaggery, and ghee",
      category: "Desserts",
      rating: 4.8,
      cookingTime: "30 mins"
    },
    {
      image: dishSambarRice,
      title: "Curd Rice",
      description: "Cool and refreshing rice mixed with yogurt and tempering",
      category: "Main Course",
      rating: 4.5,
      cookingTime: "12 mins"
    },
    {
      image: dishIdli,
      title: "Mini Idli",
      description: "Button-sized idlis tossed in flavorful sambar",
      category: "Snacks",
      rating: 4.7,
      cookingTime: "15 mins"
    },
    {
      image: dishMasalaDosa,
      title: "Onion Rava Dosa",
      description: "Crispy semolina crepe topped with caramelized onions",
      category: "Breakfast",
      rating: 4.8,
      cookingTime: "18 mins"
    },
  ];

  const categories = ["All", "Breakfast", "Main Course", "Snacks", "Desserts"];

  const filteredDishes = selectedCategory === "All"
    ? allDishes
    : allDishes.filter(dish => dish.category === selectedCategory);

  useEffect(() => {
    setVisibleCards([]);
    cardRefs.current = [];
  }, [selectedCategory]);

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
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredDishes.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <KolamPattern />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="text-accent font-semibold text-sm tracking-wider uppercase">
                Complete Menu
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Our Full Menu
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our authentic Tamil Nadu delicacies
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? "shadow-lg scale-105"
                    : "hover:scale-105"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredDishes.map((dish, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`transition-all duration-500 ${
                  visibleCards[index]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Card className="group overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative overflow-hidden aspect-square">
                      <div className="absolute top-3 right-3 z-20">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-foreground">
                            {dish.rating}
                          </span>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                      <img
                        src={dish.image}
                        alt={dish.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge variant="secondary" className="text-xs">
                          {dish.cookingTime}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-sm md:text-base mb-2 text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {dish.title}
                      </h3>

                      <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-grow">
                        {dish.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <Badge variant="outline" className="text-xs">
                          {dish.category}
                        </Badge>
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-accent"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {filteredDishes.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No dishes found in this category.
              </p>
            </div>
          )}

          <div className="text-center mt-16">
            <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-card/80 backdrop-blur-sm rounded-2xl border-2 border-border shadow-lg">
              <h3 className="text-xl font-bold text-foreground">
                Ready to Order?
              </h3>
              <p className="text-muted-foreground max-w-md">
                Visit any of our locations or contact us for home delivery and catering services
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-2">
                <Button
                  onClick={() => navigate('/#locations')}
                  variant="default"
                  className="rounded-full"
                >
                  View Locations
                </Button>
                <Button
                  onClick={() => navigate('/#contact')}
                  variant="outline"
                  className="rounded-full"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FullMenu;
