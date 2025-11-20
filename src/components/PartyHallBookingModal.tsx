import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, Phone, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  PartyHall,
  checkAvailability,
  getBookedSlots,
  createBooking,
  TimeSlot,
} from '@/lib/partyHallService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface PartyHallBookingModalProps {
  selectedHall: PartyHall;
  onSuccess: () => void;
}

const TIME_SLOTS: { value: TimeSlot; label: string; time: string }[] = [
  { value: 'morning', label: 'Morning', time: '6:00 AM - 12:00 PM' },
  { value: 'evening', label: 'Evening', time: '12:00 PM - 6:00 PM' },
  { value: 'night', label: 'Night', time: '6:00 PM - 12:00 AM' },
];

const PartyHallBookingModal = ({
  selectedHall,
  onSuccess,
}: PartyHallBookingModalProps) => {
  const [step, setStep] = useState<'date' | 'slots' | 'form' | 'alternatives'>('date');
  const [date, setDate] = useState<Date>();
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
  const [alternativeHalls, setAlternativeHalls] = useState<PartyHall[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    purpose: '',
  });

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    setStep('slots');
    
    // Load booked slots for this date
    try {
      const slots = await getBookedSlots(selectedHall.id, format(selectedDate, 'yyyy-MM-dd'));
      setBookedSlots(slots);
      setSelectedSlots([]);
    } catch (error) {
      console.error('Error loading booked slots:', error);
      setBookedSlots([]);
    }
  };

  const handleSlotToggle = (slot: TimeSlot) => {
    if (bookedSlots.includes(slot)) return; // Can't select booked slots
    
    setSelectedSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const handleCheckAvailability = async () => {
    if (!date || selectedSlots.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select at least one time slot',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkAvailability(
        selectedHall.id,
        format(date, 'yyyy-MM-dd'),
        selectedSlots
      );

      if (result.isAvailable) {
        setStep('form');
        toast({
          title: 'Available!',
          description: `${selectedHall.name} is available on ${format(date, 'PPP')}`,
        });
      } else {
        setAlternativeHalls(result.alternativeHalls || []);
        setStep('alternatives');
        toast({
          title: 'Not Available',
          description: `Some selected time slots are already booked`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to check availability',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || selectedSlots.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select date and time slots',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking({
        hall_id: selectedHall.id,
        booking_date: format(date, 'yyyy-MM-dd'),
        time_slots: selectedSlots,
        ...formData,
      });

      toast({
        title: 'Booking Submitted!',
        description:
          'Your booking request has been submitted. Our team will contact you soon for confirmation.',
      });

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit booking',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hall Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedHall.name}</span>
            <Badge variant="secondary">
              Capacity: {selectedHall.capacity_min}-{selectedHall.capacity_max}
            </Badge>
          </CardTitle>
          <CardDescription className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{selectedHall.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{selectedHall.phone}</span>
            </div>
            {selectedHall.maps_url && (
              <a
                href={selectedHall.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Map</span>
              </a>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step 1: Date Selection */}
      {step === 'date' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </CardTitle>
            <CardDescription>Choose your preferred date for the event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Time Slot Selection */}
      {step === 'slots' && date && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select Time Slots
            </CardTitle>
            <CardDescription>
              Selected Date: {format(date, 'PPP')} - Choose one or more time slots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot.value);
                const isSelected = selectedSlots.includes(slot.value);

                return (
                  <div
                    key={slot.value}
                    onClick={() => !isBooked && handleSlotToggle(slot.value)}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all',
                      isBooked && 'bg-destructive/10 border-destructive cursor-not-allowed opacity-60',
                      !isBooked && isSelected && 'bg-primary/10 border-primary',
                      !isBooked && !isSelected && 'bg-muted/30 border-border hover:border-primary/50'
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={isBooked}
                      className="pointer-events-none"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{slot.label}</h4>
                        {isBooked ? (
                          <Badge variant="destructive">Booked</Badge>
                        ) : (
                          <Badge variant="secondary">Available</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{slot.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 justify-between pt-4">
              <Button variant="outline" onClick={() => setStep('date')}>
                Back
              </Button>
              <Button
                onClick={handleCheckAvailability}
                disabled={selectedSlots.length === 0 || isChecking}
              >
                {isChecking ? 'Checking...' : 'Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Alternative Halls */}
      {step === 'alternatives' && (
        <Card>
          <CardHeader>
            <CardTitle>Alternative Party Halls</CardTitle>
            <CardDescription>
              {alternativeHalls.length > 0
                ? 'These halls are available on your selected date and time'
                : 'No alternative halls available for selected time slots'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alternativeHalls.map((hall) => (
              <Card key={hall.id} className="cursor-pointer hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{hall.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{hall.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{hall.phone}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            <Button variant="outline" onClick={() => setStep('slots')} className="w-full">
              Back to Time Slots
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Booking Form */}
      {step === 'form' && date && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
            <CardDescription>
              {format(date, 'PPP')} - {selectedSlots.map(s => TIME_SLOTS.find(ts => ts.value === s)?.label).join(', ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Full Name *</Label>
                <Input
                  id="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_phone">Phone Number *</Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  required
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Event *</Label>
                <Textarea
                  id="purpose"
                  required
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  placeholder="e.g., Birthday party, Wedding reception, Corporate event"
                />
              </div>

              <div className="flex gap-2 justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('slots')}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartyHallBookingModal;
