import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img 
              src={logo} 
              alt="Annamaye Eatery" 
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-primary-foreground/80">
              Authentic Tamil Nadu vegetarian cuisine in the heart of Coimbatore.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p>123 Gandhi Road, RS Puram, Coimbatore - 641002, Tamil Nadu</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <p>+91 422 123 4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <p>info@purevegparadise.com</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Opening Hours</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-start gap-2">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p>Mon - Sun</p>
                  <p>7:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <a href="#hero" className="block hover:text-gold transition-colors">
                Home
              </a>
              <a href="#menu" className="block hover:text-gold transition-colors">
                Menu
              </a>
              <a href="#catering" className="block hover:text-gold transition-colors">
                Services
              </a>
              <a href="#party-halls" className="block hover:text-gold transition-colors">
                Party Halls
              </a>
              <a href="#testimonials" className="block hover:text-gold transition-colors">
                Reviews
              </a>
            </div>
          </div>
        </div>

<div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/80">
  <p>&copy; 2025 Pure Veg Paradise. All rights reserved.</p>
  <a
    href="https://zouiscorp.in"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-4 px-3 py-1 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors"
  >
    Developed by Zouis corp.
  </a>
</div>
      </div>
    </footer>
  );
};

export default Footer;
