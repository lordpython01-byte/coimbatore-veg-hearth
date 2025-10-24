import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PartyHalls = () => {
  const partyHallImageUrl = "https://images.unsplash.com/photo-1519167758481-83f29da8c389?w=800&q=80";
  const [open, setOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const features = [
    "Spacious halls accommodating 50-500 guests",
    "Traditional Tamil Nadu decor with modern amenities",
    "Customizable menu options for all occasions",
    "Professional service staff",
    "Audio-visual equipment available",
    "Ample parking space",
  ];

  const handleCheckAvailability = () => {
    if (!selectedHall || !date) {
      toast({
        title: "Missing Information",
        description: "Please select a hall and date",
        variant: "destructive",
      });
      return;
    }
    // Simulate availability check
    setIsAvailable(true);
    toast({
      title: "Available!",
      description: `${selectedHall} is available on ${format(date, "PPP")}`,
    });
  };

  const handleBookNow = () => {
    toast({
      title: "Booking Successful!",
      description: "Our team will contact you soon",
    });
    // Reset form
    setOpen(false);
    setSelectedHall("");
    setDate(undefined);
    setIsAvailable(null);
    setShowCalendar(false);
  };

  return (
    <section id="party-halls" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">Celebrations</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Premium Party Halls
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrate your special moments in our elegant party halls
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
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
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gold mr-3 text-xl">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="w-full border-2 border-primary"
                >
                  Book Your Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Book Your Party Hall</DialogTitle>
                  <DialogDescription>
                    Select your preferred hall and date to check availability
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Hall Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Hall</label>
                    <Select value={selectedHall} onValueChange={setSelectedHall}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a hall" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Party Hall 1">Party Hall 1 (50-150 guests)</SelectItem>
                        <SelectItem value="Party Hall 2">Party Hall 2 (150-300 guests)</SelectItem>
                        <SelectItem value="Party Hall 3">Party Hall 3 (300-500 guests)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Date</label>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                      onClick={() => setShowCalendar(!showCalendar)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    {showCalendar && (
                      <div className="border rounded-lg p-3 bg-background">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setShowCalendar(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </div>
                    )}
                  </div>

                  {/* Check Availability Button */}
                  <Button
                    onClick={handleCheckAvailability}
                    className="w-full"
                    variant="outline"
                  >
                    Check Availability
                  </Button>

                  {/* Book Now Button - Only show if available */}
                  {isAvailable && (
                    <Button
                      onClick={handleBookNow}
                      className="w-full border-2 border-primary"
                      size="lg"
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartyHalls;
