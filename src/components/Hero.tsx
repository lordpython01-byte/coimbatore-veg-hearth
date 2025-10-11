import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 text-center text-white z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Pure Veg Paradise
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in">
          Experience Authentic Tamil Nadu Cuisine in Coimbatore
        </p>
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto animate-fade-in">
          Classic Taste. Pure Ingredients. High-Class Dining.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary"
            onClick={() => scrollToSection("menu")}
          >
            View Menu
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-white/10 text-white border-2 border-white hover:bg-white hover:text-primary"
            onClick={() => scrollToSection("catering")}
          >
            Our Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
