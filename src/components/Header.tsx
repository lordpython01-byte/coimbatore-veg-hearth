import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

interface HeaderProps {
  variant?: "transparent" | "solid";
}

const Header = ({ variant = "transparent" }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const isSolid = variant === "solid";
  const shouldUseDarkStyle = isSolid || isScrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={`container mx-auto px-6 py-4 flex items-center justify-between rounded-2xl transition-all duration-300 ${
          isSolid
            ? "bg-background/95 backdrop-blur-xl shadow-xl border-2 border-border"
            : isScrolled
            ? "bg-background/95 backdrop-blur-xl shadow-2xl border-2 border-border"
            : "bg-background/10 backdrop-blur-md border-2 border-white/10"
        }`}
      >
        <div className="flex items-center">
          <img
            src={logo}
            alt="Annamaye Eatery"
            className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 ${
              shouldUseDarkStyle ? "" : "brightness-0 invert"
            }`}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("hero")}
            className={`transition-colors ${shouldUseDarkStyle ? "text-foreground hover:text-primary" : "text-white hover:text-accent"}`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("catering")}
            className={`transition-colors ${shouldUseDarkStyle ? "text-foreground hover:text-primary" : "text-white hover:text-accent"}`}
          >
            Restaurant & Catering
          </button>
          <button
            onClick={() => scrollToSection("party-halls")}
            className={`transition-colors ${shouldUseDarkStyle ? "text-foreground hover:text-primary" : "text-white hover:text-accent"}`}
          >
            Party Halls
          </button>
          <button
            onClick={() => scrollToSection("menu")}
            className={`transition-colors ${shouldUseDarkStyle ? "text-foreground hover:text-primary" : "text-white hover:text-accent"}`}
          >
            Menu
          </button>
          <button
            onClick={() => scrollToSection("gallery")}
            className={`transition-colors ${shouldUseDarkStyle ? "text-foreground hover:text-primary" : "text-white hover:text-accent"}`}
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection("testimonials")}
            className={`transition-colors ${shouldUseDarkStyle ? "text-foreground hover:text-primary" : "text-white hover:text-accent"}`}
          >
            Reviews
          </button>
          <Button onClick={() => scrollToSection("menu")}>
            View Full Menu
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden ${shouldUseDarkStyle ? "text-foreground" : "text-white"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur-xl border-t border-border/50 rounded-b-2xl">
          <div className="px-6 py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-left text-foreground hover:text-primary transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("catering")}
              className="text-left text-foreground hover:text-primary transition-colors"
            >
              Restaurant & Catering
            </button>
            <button
              onClick={() => scrollToSection("party-halls")}
              className="text-left text-foreground hover:text-primary transition-colors"
            >
              Party Halls
            </button>
            {/*<button
              onClick={() => scrollToSection("menu")}
              className="text-left text-foreground hover:text-primary transition-colors"
            >
              Menu
            </button>*/}
            <button
              onClick={() => scrollToSection("gallery")}
              className="text-left text-foreground hover:text-primary transition-colors"
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-left text-foreground hover:text-primary transition-colors"
            >
              Reviews
            </button>
            <Button onClick={() => navigate("/full-menu")}>
              Menu
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
