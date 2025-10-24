import { useState, useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  cooking_time: string;
  category_id: string;
  category_name?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
}

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

const Menu = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("menu_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (categoriesError) throw categoriesError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("menu_items")
        .select(`
          *,
          category:menu_categories(name)
        `)
        .eq("is_available", true)
        .order("display_order")
        .limit(9);

      if (itemsError) throw itemsError;

      setCategories(categoriesData || []);

      const formattedItems = itemsData?.map(item => ({
        ...item,
        category_name: item.category?.name
      })) || [];

      setMenuItems(formattedItems);
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category_name === selectedCategory);

  useEffect(() => {
    setVisibleCards([]);
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
  }, [filteredItems.length]);

  const allCategories = ["All", ...categories.map(cat => cat.name)];

  return (
    <section id="menu" className="py-20 bg-background relative overflow-hidden">
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

          <div className="flex justify-center items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rotate-45 bg-primary opacity-60"></div>
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map((category) => (
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

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading menu...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto relative">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`transition-all duration-500 ${
                    visibleCards[index]
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  } ${index === 8 ? 'relative overflow-hidden' : ''}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Card className="group overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-card h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden aspect-square">
                        <div className="absolute top-3 right-3 z-20">
                          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-foreground">
                              {item.rating}
                            </span>
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Badge variant="secondary" className="text-xs">
                            {item.cooking_time}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 md:p-4 flex flex-col flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors flex-1">
                            {item.name}
                          </h3>
                          <span className="font-bold text-primary text-sm md:text-base ml-2 whitespace-nowrap">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed flex-grow">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <Badge variant="outline" className="text-xs">
                            {item.category_name}
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
                  {index === 8 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none z-10"></div>
                  )}
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No items available in this category.</p>
              </div>
            )}
          </>
        )}

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
