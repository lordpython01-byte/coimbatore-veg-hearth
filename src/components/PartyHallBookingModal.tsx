import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, Phone, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  PartyHall,
  checkAvailability,
  getBookedDates,
  createBooking,
} from '@/lib/partyHallService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PartyHallBookingModalProps {
  selectedHall: PartyHall;
  onSuccess: () => void;
}

const PartyHallBookingModal = ({
  selectedHall,
  onSuccess,
}: PartyHallBookingModalProps) => {
  const [step, setStep] = useState<'date' | 'form' | 'alternatives'>('date');
  const [date, setDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(true);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [alternativeHalls, setAlternativeHalls] = useState<PartyHall[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    purpose: '',
  });

  useEffect(() => {
    const loadBookedDates = async () => {
      try {
        const dates = await getBookedDates(selectedHall.id);
        setBookedDates(dates);
      } catch (error) {
        console.error('Error loading booked dates:', error);
      }
    };
    loadBookedDates();
  }, [selectedHall.id]);

  const handleCheckAvailability = async () => {
    if (!date) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date',
        variant: 'destructive',
      });
      return;
    }

    setIsChecking(true);
    try {
      const result = await checkAvailability(
        selectedHall.id,
        format(date, 'yyyy-MM-dd')
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
          description: `${selectedHall.name} is already booked on ${format(date, 'PPP')}`,
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

    if (!date) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking({
        hall_id: selectedHall.id,
        booking_date: format(date, 'yyyy-MM-dd'),
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

  const isDateBooked = (checkDate: Date) => {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    return bookedDates.includes(dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{selectedHall.name}</h3>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {selectedHall.location}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            {selectedHall.phone}
          </p>
          <p className="text-muted-foreground">
            Capacity: {selectedHall.capacity_min}-{selectedHall.capacity_max}{' '}
            guests
          </p>
          {selectedHall.maps_url && (
            <a
              href={selectedHall.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              View on Google Maps
            </a>
          )}
        </div>
      </div>

      {step === 'date' && (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Select Date</Label>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
            {showCalendar && (
              <div className="border rounded-lg p-3 bg-background mt-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                  }}
                  disabled={(checkDate) =>
                    checkDate < new Date() || isDateBooked(checkDate)
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
                {bookedDates.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Dates with existing bookings are disabled
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleCheckAvailability}
            className="w-full"
            disabled={!date || isChecking}
          >
            {isChecking ? 'Checking...' : 'Check Availability'}
          </Button>
        </div>
      )}

      {step === 'alternatives' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">
              Hall Not Available
            </h4>
            <p className="text-sm text-red-700">
              {selectedHall.name} is already booked on {date && format(date, 'PPP')}.
              Please try one of these available halls:
            </p>
          </div>

          {alternativeHalls.length > 0 ? (
            <div className="space-y-3">
              {alternativeHalls.map((hall) => (
                <Card key={hall.id} className="border-2 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      {hall.name}
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Available
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      <div className="space-y-1 text-xs">
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {hall.location}
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {hall.phone}
                        </p>
                        <p>
                          Capacity: {hall.capacity_min}-{hall.capacity_max} guests
                        </p>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      Book {hall.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Unfortunately, all halls are booked on this date. Please select a
                different date.
              </p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setStep('date');
              setDate(undefined);
              setAlternativeHalls([]);
            }}
          >
            Try Different Date
          </Button>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              Hall is available on {date && format(date, 'PPP')}
            </p>
          </div>

          <div>
            <Label htmlFor="customer_name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <Label htmlFor="customer_phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) =>
                setFormData({ ...formData, customer_phone: e.target.value })
              }
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <Label htmlFor="customer_email">
              Email Address <span className="text-muted-foreground text-xs">(Optional)</span>
            </Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) =>
                setFormData({ ...formData, customer_email: e.target.value })
              }
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="purpose">
              Purpose of Booking <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) =>
                setFormData({ ...formData, purpose: e.target.value })
              }
              required
              placeholder="e.g., Birthday party, Wedding reception, Corporate event"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-1/3"
              onClick={() => {
                setStep('date');
                setFormData({
                  customer_name: '',
                  customer_phone: '',
                  customer_email: '',
                  purpose: '',
                });
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PartyHallBookingModal;
