import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import L from "leaflet";
import { MapPin, Phone, Navigation, ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  map_url: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  opening_time: string;
  closing_time: string;
  display_order: number;
}

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

const getLocationColor = (name: string) => {
  if (name.toLowerCase().includes('kitchen')) return "#ff6600";
  if (name.toLowerCase().includes('hall')) return "#3b82f6";
  if (name.toLowerCase().includes('restaurant')) return "#10b981";
  return "#6b7280";
};

const getLocationType = (name: string) => {
  if (name.toLowerCase().includes('kitchen')) return "Kitchen";
  if (name.toLowerCase().includes('hall')) return "Party Hall";
  if (name.toLowerCase().includes('restaurant')) return "Restaurant";
  return "Location";
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

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['public-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Location[];
    },
  });

  const locationsWithCoordinates = locations.filter(loc => loc.latitude && loc.longitude);

  const filteredLocations = activeFilter === "All"
    ? locationsWithCoordinates
    : locationsWithCoordinates.filter(loc => getLocationType(loc.name) === activeFilter);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    if (location.latitude && location.longitude) {
      setMapCenter([location.latitude, location.longitude]);
      setMapZoom(15);
    }
  };

  const phoneNumbers = (phone: string) => {
    return phone.split(',').map(p => p.trim()).filter(Boolean);
  };

  useEffect(() => {
    if (locationsWithCoordinates.length > 0 && !selectedLocation) {
      const firstLoc = locationsWithCoordinates[0];
      if (firstLoc.latitude && firstLoc.longitude) {
        setMapCenter([firstLoc.latitude, firstLoc.longitude]);
      }
    }
  }, [locationsWithCoordinates.length]);

  if (isLoading) {
    return (
      <section id="locations" className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading locations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (locationsWithCoordinates.length === 0) {
    return (
      <section id="locations" className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">No locations available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

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
                if (locationsWithCoordinates.length > 0) {
                  const firstLoc = locationsWithCoordinates[0];
                  if (firstLoc.latitude && firstLoc.longitude) {
                    setMapCenter([firstLoc.latitude, firstLoc.longitude]);
                  }
                }
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
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                {filteredLocations.map((location) => (
                  location.latitude && location.longitude && (
                    <Marker
                      key={location.id}
                      position={[location.latitude, location.longitude]}
                      icon={createCustomIcon(getLocationColor(location.name))}
                      eventHandlers={{
                        click: () => handleLocationClick(location)
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-2 min-w-[200px]">
                          <h4 className="font-semibold text-sm mb-2">{location.name}</h4>
                          <Badge variant={getTypeBadgeVariant(getLocationType(location.name))} className="mb-3 text-xs">
                            {getLocationType(location.name)}
                          </Badge>
                          <div className="space-y-2 text-xs">
                            {phoneNumbers(location.phone).map((phone, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                <a href={`tel:${phone}`} className="hover:text-primary">
                                  {phone}
                                </a>
                              </div>
                            ))}
                            {location.opening_time && location.closing_time && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{location.opening_time} - {location.closing_time}</span>
                              </div>
                            )}
                            {location.map_url && (
                              <a
                                href={location.map_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-primary hover:underline font-medium mt-2"
                              >
                                <Navigation className="w-3 h-3" />
                                <span>Open in Google Maps</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
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
                        style={{ backgroundColor: getLocationColor(location.name) }}
                      >
                        <MapPin className="w-5 h-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-foreground leading-tight text-sm">
                            {location.name}
                          </h4>
                        </div>

                        <Badge variant={getTypeBadgeVariant(getLocationType(location.name))} className="mb-3">
                          {getLocationType(location.name)}
                        </Badge>

                        <p className="text-xs text-muted-foreground mb-3">
                          {location.address}, {location.city}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col gap-1">
                              {phoneNumbers(location.phone).map((phone, idx) => (
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

                          {location.opening_time && location.closing_time && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>{location.opening_time} - {location.closing_time}</span>
                            </div>
                          )}

                          {location.map_url && (
                            <a
                              href={location.map_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Navigation className="w-4 h-4" />
                              <span>Get Directions</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
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
        .leaflet-container {
          z-index: 1 !important;
        }
        .leaflet-pane {
          z-index: auto !important;
        }
        .leaflet-control-container {
          z-index: 10 !important;
        }
      `}</style>
    </section>
  );
};

export default Locations;
