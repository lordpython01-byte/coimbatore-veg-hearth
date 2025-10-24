import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, ExternalLink, Users } from 'lucide-react';
import { fetchPartyHalls, PartyHall } from '@/lib/partyHallService';
import PartyHallBookingModal from './PartyHallBookingModal';

const PartyHalls = () => {
  const partyHallImageUrl = 'https://images.pexels.com/photos/7856735/pexels-photo-7856735.jpeg';
  const [open, setOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<PartyHall | null>(null);

  const { data: partyHalls = [], isLoading } = useQuery({
    queryKey: ['party-halls'],
    queryFn: fetchPartyHalls,
  });

  const features = [
    'Spacious halls accommodating 50-500 guests',
    'Traditional Tamil Nadu decor with modern amenities',
    'Customizable menu options for all occasions',
    'Professional service staff',
    'Audio-visual equipment available',
    'Ample parking space',
  ];

  const handleBookHall = (hall: PartyHall) => {
    setSelectedHall(hall);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedHall(null);
  };

  const handleBookingSuccess = () => {
    setOpen(false);
    setSelectedHall(null);
  };

  return (
    <section id="party-halls" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">
              Celebrations
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Premium Party Halls
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrate your special moments in our elegant party halls
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <img
              src={partyHallImageUrl}
              alt="Elegant party hall"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>

          <Card className="p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-semibold mb-6">
              Perfect Venue for Every Occasion
            </h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gold mr-3 text-xl">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-primary">
            Our Party Halls
          </h3>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading party halls...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partyHalls.map((hall) => (
                <Card
                  key={hall.id}
                  className="hover:shadow-xl transition-shadow border-2 border-primary/10"
                >
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-xl">{hall.name}</span>
                      <Badge variant="secondary" className="ml-2">
                        Available
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{hall.location}</span>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <a
                          href={`tel:${hall.phone}`}
                          className="hover:text-primary"
                        >
                          {hall.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>
                          {hall.capacity_min}-{hall.capacity_max} guests
                        </span>
                      </p>
                      {hall.maps_url && (
                        <a
                          href={hall.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on Google Maps
                        </a>
                      )}
                    </div>
                    <Button
                      onClick={() => handleBookHall(hall)}
                      className="w-full mt-4"
                      size="lg"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={open} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book Your Party Hall</DialogTitle>
            </DialogHeader>
            {selectedHall && (
              <PartyHallBookingModal
                selectedHall={selectedHall}
                onSuccess={handleBookingSuccess}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PartyHalls;
