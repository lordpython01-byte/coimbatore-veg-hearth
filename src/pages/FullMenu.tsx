import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import menu1 from "@/assets/menu_1.jpg";
import menu2 from "@/assets/menu_2.jpg";
import menu3 from "@/assets/menu_3.jpg";
import menu4 from "@/assets/menu_4.jpg";

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

  const menuPages = [
    { image: menu1, title: "Breakfast Specials", page: 1 },
    { image: menu2, title: "Main Course", page: 2 },
    { image: menu3, title: "Appetizers & Snacks", page: 3 },
    { image: menu4, title: "Beverages & Desserts", page: 4 },
  ];

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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-accent font-semibold text-sm tracking-wider uppercase">Complete Menu</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary animate-fade-in">
              Full Menu
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our complete selection of authentic Tamil Nadu cuisine
            </p>
            
            {/* Decorative border */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary"></div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rotate-45 bg-primary opacity-60"></div>
                ))}
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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

                  <div className="group relative overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 cursor-pointer bg-card/95 backdrop-blur-sm rounded-lg">
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

                      {/* Title section */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="bg-gradient-to-r from-primary via-primary to-accent p-3 rounded-lg border border-primary-foreground/10">
                          <h3 className="text-primary-foreground font-bold text-lg md:text-xl leading-tight text-center">
                            {menu.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
