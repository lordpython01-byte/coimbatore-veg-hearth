import { useState } from "react";
import menu1 from "@/assets/menu_1.jpg";
import menu2 from "@/assets/menu_2.jpg";
import menu3 from "@/assets/menu_3.jpg";
import menu4 from "@/assets/menu_4.jpg";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Menu = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const menuPages = [
    { image: menu1, title: "Breakfast Specials", page: 1 },
    { image: menu2, title: "Main Course", page: 2 },
    { image: menu3, title: "Appetizers & Snacks", page: 3 },
    { image: menu4, title: "Beverages & Desserts", page: 4 },
  ];

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary animate-fade-in">
            Our Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our authentic Tamil Nadu delicacies
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {menuPages.map((menu, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0 relative">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/90 via-brown-dark/40 to-transparent z-10 group-hover:from-primary/90 transition-all duration-500"></div>
                  
                  <img
                    src={menu.image}
                    alt={menu.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-all duration-500 group-hover:translate-y-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-accent font-bold text-sm tracking-wider">
                        PAGE {menu.page}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-card/20 backdrop-blur-sm hover:bg-card/40 text-primary-foreground h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        onClick={() => setSelectedImage(menu.image)}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="text-primary-foreground font-bold text-xl md:text-2xl leading-tight">
                      {menu.title}
                    </h3>
                  </div>

                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground font-bold text-xs px-3 py-1.5 rounded-full">
                      MENU
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Click on any menu card to view in detail
          </p>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full p-2 bg-card">
          <img
            src={selectedImage || ""}
            alt="Menu detail"
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Menu;
