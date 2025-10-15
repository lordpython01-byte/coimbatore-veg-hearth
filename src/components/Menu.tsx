import { useState } from "react";
import menu1 from "@/assets/menu_1.jpg";
import menu2 from "@/assets/menu_2.jpg";
import menu3 from "@/assets/menu_3.jpg";
import menu4 from "@/assets/menu_4.jpg";
import { Maximize2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const menuPages = [
    { image: menu1, title: "Breakfast Specials", page: 1 },
    { image: menu2, title: "Main Course", page: 2 },
    { image: menu3, title: "Appetizers & Snacks", page: 3 },
    { image: menu4, title: "Beverages & Desserts", page: 4 },
  ];

  return (
    <section id="menu" className="py-20 bg-gradient-to-br from-secondary/30 via-background to-secondary/20 relative overflow-hidden">
      {/* Background Kolam Pattern */}
      <div className="absolute inset-0 opacity-5">
        <KolamPattern />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Decorative top border */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 rotate-45 bg-primary opacity-60"></div>
              ))}
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary animate-fade-in">
            Our Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Explore our authentic Tamil Nadu delicacies
          </p>
          
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {menuPages.map((menu, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
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

                <Card className="group relative overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 cursor-pointer bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-0 relative">
                    <div className="relative overflow-hidden aspect-[3/4]">
                      {/* Inner decorative frame */}
                      <div className="absolute inset-0 z-10 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-brown-dark/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-brown-dark/95 via-brown-dark/60 to-transparent"></div>
                      </div>

                      <img
                        src={menu.image}
                        alt={menu.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Page number badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-md"></div>
                          <div className="relative bg-primary text-primary-foreground font-bold text-xs px-3 py-1.5 rounded-full border-2 border-primary-foreground/20">
                            PAGE {menu.page}
                          </div>
                        </div>
                      </div>

                      {/* Zoom button */}
                      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-9 w-9 rounded-full shadow-lg"
                          onClick={() => setSelectedImage(menu.image)}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Title section */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="bg-gradient-to-r from-primary via-primary to-accent p-3 rounded-lg border border-primary-foreground/10">
                          <h3 className="text-primary-foreground font-bold text-lg md:text-xl leading-tight text-center">
                            {menu.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Click on any card to view full menu
            </p>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i * 200}ms` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl w-full p-6 bg-card border-4 border-primary/30">
          <div className="relative">
            {/* Decorative corners for dialog */}
            <KolamCorner className="absolute -top-2 -left-2 text-primary w-8 h-8" />
            <KolamCorner className="absolute -top-2 -right-2 text-primary w-8 h-8 rotate-90" />
            <KolamCorner className="absolute -bottom-2 -left-2 text-accent w-8 h-8 -rotate-90" />
            <KolamCorner className="absolute -bottom-2 -right-2 text-accent w-8 h-8 rotate-180" />
            
            <img
              src={selectedImage || ""}
              alt="Menu detail"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Menu;
