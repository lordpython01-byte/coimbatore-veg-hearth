/*
  # Create Locations, Reviews, and Bookings Tables

  1. New Tables
    - `locations`
      - `id` (uuid, primary key)
      - `name` (text) - Location name
      - `address` (text) - Full address
      - `city` (text) - City name
      - `phone` (text) - Contact phone
      - `email` (text) - Contact email
      - `map_url` (text) - Google Maps URL
      - `is_active` (boolean) - Whether location is active
      - `opening_time` (text) - Opening time
      - `closing_time` (text) - Closing time
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `customer_reviews`
      - `id` (uuid, primary key)
      - `customer_name` (text) - Customer name
      - `rating` (integer) - Rating 1-5
      - `review_text` (text) - Review content
      - `is_approved` (boolean) - Admin approval status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `party_hall_bookings`
      - `id` (uuid, primary key)
      - `hall_name` (text) - Hall name
      - `customer_name` (text) - Customer name
      - `customer_phone` (text) - Customer phone
      - `customer_email` (text) - Customer email
      - `booking_date` (date) - Event date
      - `event_type` (text) - Type of event
      - `guest_count` (integer) - Number of guests
      - `status` (text) - Booking status
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for active locations and approved reviews
    - Admin write access for authenticated users
*/

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  email text,
  map_url text,
  is_active boolean DEFAULT true,
  opening_time text DEFAULT '09:00',
  closing_time text DEFAULT '22:00',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create customer_reviews table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create party_hall_bookings table
CREATE TABLE IF NOT EXISTS party_hall_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_name text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  booking_date date NOT NULL,
  event_type text,
  guest_count integer DEFAULT 0,
  status text DEFAULT 'booked' CHECK (status IN ('booked', 'available', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_locations_display_order ON locations(display_order);
CREATE INDEX IF NOT EXISTS idx_locations_is_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_is_approved ON customer_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_created_at ON customer_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_booking_date ON party_hall_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_status ON party_hall_bookings(status);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_hall_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for locations
-- Public can view active locations
CREATE POLICY "Anyone can view active locations"
  ON locations FOR SELECT
  USING (is_active = true);

-- Admins can manage all locations (no auth.uid check needed for custom admin)
CREATE POLICY "Allow all reads for admin"
  ON locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all inserts for admin"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all updates for admin"
  ON locations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all deletes for admin"
  ON locations FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for customer_reviews
-- Public can view approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON customer_reviews FOR SELECT
  USING (is_approved = true);

-- Public can submit reviews
CREATE POLICY "Anyone can insert reviews"
  ON customer_reviews FOR INSERT
  WITH CHECK (true);

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
  ON customer_reviews FOR SELECT
  TO authenticated
  USING (true);

-- Admins can update reviews
CREATE POLICY "Admins can update reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
  ON customer_reviews FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for party_hall_bookings
-- Public can view available bookings
CREATE POLICY "Anyone can view available bookings"
  ON party_hall_bookings FOR SELECT
  USING (status = 'available');

-- Public can insert bookings
CREATE POLICY "Anyone can insert bookings"
  ON party_hall_bookings FOR INSERT
  WITH CHECK (true);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON party_hall_bookings FOR SELECT
  TO authenticated
  USING (true);

-- Admins can update bookings
CREATE POLICY "Admins can update bookings"
  ON party_hall_bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON party_hall_bookings FOR DELETE
  TO authenticated
  USING (true);

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_reviews_updated_at ON customer_reviews;
CREATE TRIGGER update_customer_reviews_updated_at
  BEFORE UPDATE ON customer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_party_hall_bookings_updated_at ON party_hall_bookings;
CREATE TRIGGER update_party_hall_bookings_updated_at
  BEFORE UPDATE ON party_hall_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for locations
INSERT INTO locations (name, address, city, phone, email, opening_time, closing_time, display_order) VALUES
  ('Annamaye Main Branch', '123 Gandhi Road, T. Nagar', 'Chennai', '+91 44 1234 5678', 'tnagar@annamaye.com', '06:00', '23:00', 1),
  ('Annamaye Express', '456 Anna Salai, Thousand Lights', 'Chennai', '+91 44 2345 6789', 'annasalai@annamaye.com', '07:00', '22:00', 2)
ON CONFLICT DO NOTHING;

-- Insert sample customer reviews
INSERT INTO customer_reviews (customer_name, rating, review_text, is_approved) VALUES
  ('Rajesh Kumar', 5, 'Excellent food and great ambiance! The dosas are the best I have ever had.', true),
  ('Priya Sharma', 5, 'Authentic South Indian taste. The sambar is amazing and the service is quick.', true),
  ('Arun Vijay', 4, 'Good food quality and reasonable prices. A must-visit for South Indian cuisine lovers.', true)
ON CONFLICT DO NOTHING;
