import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
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

const locations: Location[] = [
  {
    id: 1,
    name: "M/S Annamaye Kitchen (Centralized Kitchen, Thirumurugan Poondi)",
    type: "Kitchen",
    phone: ["9159671437", "9342085599", "9566446713"],
    mapUrl: "https://maps.app.goo.gl/9vAThuJfRgch9ZJVA",
    coordinates: { lat: 11.1646, lng: 77.3149 }
  },
  {
    id: 2,
    name: "Annamaye Hall (Poondi)",
    type: "Party Hall",
    phone: ["9363009645"],
    mapUrl: "https://maps.app.goo.gl/NaurS4tSzUu2jHZb6",
    coordinates: { lat: 11.1683, lng: 77.3128 }
  },
  {
    id: 3,
    name: "Velan Hall (Poondi)",
    type: "Party Hall",
    phone: ["9363009645"],
    mapUrl: "https://maps.app.goo.gl/UucpoTadP5PJmkrv9",
    coordinates: { lat: 11.1670, lng: 77.3110 }
  },
  {
    id: 4,
    name: "Kandavel Mahal (Avinashi)",
    type: "Party Hall",
    phone: ["9578789616"],
    mapUrl: "https://maps.app.goo.gl/HFeuvg7AT2yjQrXr7",
    coordinates: { lat: 11.1906, lng: 77.2681 }
  },
  {
    id: 5,
    name: "Restaurant - Mangalam Road (Bypass Branch)",
    type: "Restaurant",
    phone: ["9600359616"],
    mapUrl: "https://maps.app.goo.gl/8wmCE1YmHZqYbJBh9",
    coordinates: { lat: 11.1053, lng: 77.3444 }
  },
  {
    id: 6,
    name: "Restaurant - Thirumurugan Poondi (Signal Branch)",
    type: "Restaurant",
    phone: ["9566342905"],
    mapUrl: "https://maps.app.goo.gl/Ed4sLm8gDjjhDuUg8",
    coordinates: { lat: 11.1639, lng: 77.3145 }
  },
  {
    id: 7,
    name: "Restaurant - Thirumurugan Poondi (Ring Road Branch)",
    type: "Restaurant",
    phone: ["8754307403"],
    mapUrl: "https://maps.app.goo.gl/wPNXSNEfmo3Afoix6",
    coordinates: { lat: 11.1603, lng: 77.3208 }
  }
];

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 30px;
      ">
        <div style="
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        ">
          <div style="
            position: absolute;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "></div>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const getLocationColor = (type: string) => {
  switch(type) {
    case "Kitchen": return "#ff6600";
    case "Party Hall": return "#3b82f6";
    case "Restaurant": return "#10b981";
    default: return "#6b7280";
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

const MapController = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const Locations = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.14, 77.35]);
  const [mapZoom, setMapZoom] = useState(11);

  const filteredLocations = activeFilter === "All"
    ? locations
    : locations.filter(loc => loc.type === activeFilter);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setMapCenter([location.coordinates.lat, location.coordinates.lng]);
    setMapZoom(15);
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
            Visit us at any of our convenient locations across Tiruppur
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
                setMapCenter([11.14, 77.35]);
                setMapZoom(11);
              }}
              className="transition-all"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px] md:h-[500px] lg:h-[600px]">
              <MapContainer
                center={[11.14, 77.35]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.coordinates.lat, location.coordinates.lng]}
                    icon={createCustomIcon(getLocationColor(location.type))}
                    eventHandlers={{
                      click: () => handleLocationClick(location)
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="p-2 min-w-[200px]">
                        <h4 className="font-semibold text-sm mb-2">{location.name}</h4>
                        <Badge variant={getTypeBadgeVariant(location.type)} className="mb-3 text-xs">
                          {location.type}
                        </Badge>
                        <div className="space-y-2 text-xs">
                          {location.phone.map((phone, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              <a href={`tel:${phone}`} className="hover:text-primary">
                                {phone}
                              </a>
                            </div>
                          ))}
                          <a
                            href={location.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline font-medium mt-2"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Open in Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="h-[400px] md:h-[500px] lg:h-[600px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {filteredLocations.map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedLocation?.id === location.id
                      ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                      : "hover:scale-[1.01]"
                  }`}
                  onClick={() => handleLocationClick(location)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        style={{ backgroundColor: getLocationColor(location.type) }}
                      >
                        <MapPin className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground leading-tight text-sm">
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
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </section>
  );
};

export default Locations;
