/*
  # Create Admin Management Tables

  ## New Tables

  ### 1. menu_items
    - `id` (uuid, primary key)
    - `name` (text) - Name of the dish
    - `description` (text) - Description of the dish
    - `price` (decimal) - Price of the dish
    - `category` (text) - Category (breakfast, lunch, dinner, snacks)
    - `image_url` (text) - Image URL
    - `is_available` (boolean) - Availability status
    - `display_order` (integer) - Display order
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 2. locations
    - `id` (uuid, primary key)
    - `name` (text) - Branch name
    - `address` (text) - Full address
    - `city` (text) - City name
    - `phone` (text) - Contact number
    - `email` (text) - Contact email
    - `map_url` (text) - Google Maps embed URL
    - `is_active` (boolean) - Active status
    - `opening_time` (time) - Opening time
    - `closing_time` (time) - Closing time
    - `display_order` (integer) - Display order
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 3. customer_reviews
    - `id` (uuid, primary key)
    - `customer_name` (text) - Customer name
    - `rating` (integer) - Rating 1-5
    - `review_text` (text) - Review content
    - `location_id` (uuid, optional) - Reference to location
    - `is_approved` (boolean) - Approval status
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### 4. party_hall_bookings
    - `id` (uuid, primary key)
    - `hall_name` (text) - Name of the hall
    - `customer_name` (text) - Customer name
    - `customer_phone` (text) - Customer phone
    - `customer_email` (text) - Customer email
    - `booking_date` (date) - Date of booking
    - `event_type` (text) - Type of event
    - `guest_count` (integer) - Number of guests
    - `status` (text) - booked, available, cancelled
    - `notes` (text) - Additional notes
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
    - Enable RLS on all tables
    - Public read access for active/approved items
    - Authenticated users can manage all data
*/

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10, 2),
  category text NOT NULL DEFAULT 'main',
  image_url text,
  is_available boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete menu items"
  ON menu_items FOR DELETE
  TO authenticated
  USING (true);

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  phone text NOT NULL,
  email text,
  map_url text,
  is_active boolean DEFAULT true,
  opening_time time,
  closing_time time,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active locations"
  ON locations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete locations"
  ON locations FOR DELETE
  TO authenticated
  USING (true);

-- Customer Reviews Table
CREATE TABLE IF NOT EXISTS customer_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
  ON customer_reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can insert reviews"
  ON customer_reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reviews"
  ON customer_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reviews"
  ON customer_reviews FOR DELETE
  TO authenticated
  USING (true);

-- Party Hall Bookings Table
CREATE TABLE IF NOT EXISTS party_hall_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_name text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  booking_date date NOT NULL,
  event_type text,
  guest_count integer,
  status text DEFAULT 'booked' CHECK (status IN ('booked', 'available', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE party_hall_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all bookings"
  ON party_hall_bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert bookings"
  ON party_hall_bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bookings"
  ON party_hall_bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON party_hall_bookings FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_display_order ON locations(display_order);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_approved ON customer_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_date ON party_hall_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_status ON party_hall_bookings(status);
