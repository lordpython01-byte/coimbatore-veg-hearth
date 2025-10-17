import { MapPin, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Location {
  name: string;
  type: string;
  phone: string[];
  mapUrl: string;
  embedUrl: string;
}

const Locations = () => {
  const locations: Location[] = [
    {
      name: "Annamaye Kitchen (Centralized Kitchen)",
      type: "Kitchen",
      phone: ["9159671437", "9342085599", "9566446713"],
      mapUrl: "https://maps.app.goo.gl/9vAThuJfRgch9ZJVA?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
    },
    {
      name: "Annamaye Hall",
      type: "Party Hall",
      phone: ["9363009645"],
      mapUrl: "https://maps.app.goo.gl/NaurS4tSzUu2jHZb6?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567891"
    },
    {
      name: "Velan Hall",
      type: "Party Hall",
      phone: ["9363009645"],
      mapUrl: "https://maps.app.goo.gl/UucpoTadP5PJmkrv9?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567892"
    },
    {
      name: "Kandavel Mahal",
      type: "Party Hall",
      phone: ["9578789616"],
      mapUrl: "https://maps.app.goo.gl/HFeuvg7AT2yjQrXr7?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567893"
    },
    {
      name: "Mangalam Road (Bypass Branch)",
      type: "Restaurant",
      phone: ["9600359616"],
      mapUrl: "https://maps.app.goo.gl/8wmCE1YmHZqYbJBh9?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567894"
    },
    {
      name: "Thirumurugan Poondi (Signal Branch)",
      type: "Restaurant",
      phone: ["9566342905"],
      mapUrl: "https://maps.app.goo.gl/Ed4sLm8gDjjhDuUg8?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567895"
    },
    {
      name: "Thirumurugan Poondi (Ring Road Branch)",
      type: "Restaurant",
      phone: ["8754307403"],
      mapUrl: "https://maps.app.goo.gl/wPNXSNEfmo3Afoix6?g_st=iwb",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.3!2d77.0!3d11.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDAwJzAwLjAiTiA3N8KwMDAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567896"
    }
  ];

  const groupedLocations = {
    Kitchen: locations.filter(l => l.type === "Kitchen"),
    "Party Halls": locations.filter(l => l.type === "Party Hall"),
    Restaurants: locations.filter(l => l.type === "Restaurant")
  };

  return (
    <section id="locations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Locations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visit us at any of our convenient locations across Coimbatore
          </p>
        </div>

        {Object.entries(groupedLocations).map(([category, locs]) => (
          <div key={category} className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-primary animate-fade-up">
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locs.map((location, index) => (
                <Card 
                  key={index}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-64 w-full">
                    <iframe
                      src={location.mapUrl.replace('maps.app.goo.gl', 'www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d')}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold mb-4 text-foreground">
                      {location.name}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex flex-col gap-1">
                          {location.phone.map((phone, idx) => (
                            <a
                              key={idx}
                              href={`tel:${phone}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>Open in Google Maps</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Locations;
