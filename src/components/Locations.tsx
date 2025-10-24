import { useState } from "react";
import { MapPin, Phone, Navigation, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: number;
  name: string;
  type: "Kitchen" | "Party Hall" | "Restaurant";
  phone: string[];
  mapUrl: string;
  coordinates: { lat: number; lng: number };
}

const Locations = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const locations: Location[] = [
    {
      id: 1,
      name: "Annamaye Kitchen (Centralized Kitchen)",
      type: "Kitchen",
      phone: ["9159671437", "9342085599", "9566446713"],
      mapUrl: "https://maps.app.goo.gl/9vAThuJfRgch9ZJVA?g_st=iwb",
      coordinates: { lat: 11.0168, lng: 76.9558 }
    },
    {
      id: 2,
      name: "Annamaye Hall",
      type: "Party Hall",
      phone: ["9363009645"],
      mapUrl: "https://maps.app.goo.gl/NaurS4tSzUu2jHZb6?g_st=iwb",
      coordinates: { lat: 11.0175, lng: 76.9565 }
    },
    {
      id: 3,
      name: "Velan Hall",
      type: "Party Hall",
      phone: ["9363009645"],
      mapUrl: "https://maps.app.goo.gl/UucpoTadP5PJmkrv9?g_st=iwb",
      coordinates: { lat: 11.0182, lng: 76.9572 }
    },
    {
      id: 4,
      name: "Kandavel Mahal",
      type: "Party Hall",
      phone: ["9578789616"],
      mapUrl: "https://maps.app.goo.gl/HFeuvg7AT2yjQrXr7?g_st=iwb",
      coordinates: { lat: 11.0665, lng: 77.0382 }
    },
    {
      id: 5,
      name: "Mangalam Road (Bypass Branch)",
      type: "Restaurant",
      phone: ["9600359616"],
      mapUrl: "https://maps.app.goo.gl/8wmCE1YmHZqYbJBh9?g_st=iwb",
      coordinates: { lat: 11.0271, lng: 76.9939 }
    },
    {
      id: 6,
      name: "Thirumurugan Poondi (Signal Branch)",
      type: "Restaurant",
      phone: ["9566342905"],
      mapUrl: "https://maps.app.goo.gl/Ed4sLm8gDjjhDuUg8?g_st=iwb",
      coordinates: { lat: 11.0161, lng: 76.9551 }
    },
    {
      id: 7,
      name: "Thirumurugan Poondi (Ring Road Branch)",
      type: "Restaurant",
      phone: ["8754307403"],
      mapUrl: "https://maps.app.goo.gl/wPNXSNEfmo3Afoix6?g_st=iwb",
      coordinates: { lat: 11.0154, lng: 76.9544 }
    }
  ];

  const filteredLocations = activeFilter === "All"
    ? locations
    : locations.filter(loc => loc.type === activeFilter);

  const getTypeColor = (type: string) => {
    switch(type) {
      case "Kitchen": return "bg-orange-500";
      case "Party Hall": return "bg-blue-500";
      case "Restaurant": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(type) {
      case "Kitchen": return "destructive";
      case "Party Hall": return "default";
      case "Restaurant": return "secondary";
      default: return "outline";
    }
  };

  const minLat = Math.min(...locations.map(l => l.coordinates.lat));
  const maxLat = Math.max(...locations.map(l => l.coordinates.lat));
  const minLng = Math.min(...locations.map(l => l.coordinates.lng));
  const maxLng = Math.max(...locations.map(l => l.coordinates.lng));

  const normalizeCoordinate = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <section id="locations" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">
              Find Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Locations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visit us at any of our convenient locations across Coimbatore
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["All", "Kitchen", "Party Hall", "Restaurant"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => {
                setActiveFilter(filter);
                setSelectedLocation(null);
              }}
              className="transition-all"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[500px] md:h-[600px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-slate-800 dark:to-slate-900">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/5 to-transparent"></div>

              <div className="absolute inset-0 p-8">
                <div className="relative w-full h-full">
                  {filteredLocations.map((location) => {
                    const x = normalizeCoordinate(location.coordinates.lng, minLng, maxLng);
                    const y = 100 - normalizeCoordinate(location.coordinates.lat, minLat, maxLat);
                    const isSelected = selectedLocation?.id === location.id;

                    return (
                      <div
                        key={location.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 hover:scale-110"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          zIndex: isSelected ? 20 : 10
                        }}
                        onClick={() => setSelectedLocation(location)}
                      >
                        <div className={`relative ${isSelected ? 'animate-bounce' : ''}`}>
                          <div className={`w-12 h-12 rounded-full ${getTypeColor(location.type)} flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-700 ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`}>
                            <MapPin className="w-6 h-6 text-white" />
                          </div>

                          {isSelected && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-background/95 backdrop-blur-sm rounded-lg shadow-xl p-3 w-64 border-2 border-primary">
                              <h4 className="font-semibold text-sm mb-2">{location.name}</h4>
                              <Badge variant={getTypeBadgeVariant(location.type)} className="mb-2 text-xs">
                                {location.type}
                              </Badge>
                              <div className="space-y-1 text-xs">
                                {location.phone.map((phone, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    <a href={`tel:${phone}`} className="hover:text-primary">
                                      {phone}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-30">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs sm:text-sm font-medium">Kitchen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs sm:text-sm font-medium">Party Hall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs sm:text-sm font-medium">Restaurant</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center z-30">
                <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  Click on any pin to view details
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="h-[500px] md:h-[600px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedLocation?.id === location.id
                      ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                      : "hover:scale-[1.01]"
                  }`}
                  onClick={() => setSelectedLocation(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${getTypeColor(location.type)} flex items-center justify-center flex-shrink-0 mt-1`}>
                        <MapPin className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground leading-tight">
                            {location.name}
                          </h4>
                        </div>

                        <Badge variant={getTypeBadgeVariant(location.type)} className="mb-3">
                          {location.type}
                        </Badge>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                              {location.phone.map((phone, idx) => (
                                <a
                                  key={idx}
                                  href={`tel:${phone}`}
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                  onClick={(e) => e.stopPropagation()}
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
                            className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Navigation className="w-4 h-4" />
                            <span>Get Directions</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </section>
  );
};

export default Locations;
