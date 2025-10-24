/*
  # Create Party Halls Master Table and Update Bookings Schema

  1. New Tables
    - `party_halls`
      - `id` (uuid, primary key)
      - `name` (text) - Hall name
      - `location` (text) - Location name (city)
      - `phone` (text) - Contact phone number
      - `maps_url` (text) - Google Maps URL
      - `capacity_min` (integer) - Minimum guest capacity
      - `capacity_max` (integer) - Maximum guest capacity
      - `is_active` (boolean) - Whether hall is active
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Schema Changes to `party_hall_bookings`
    - Add `hall_id` (uuid, foreign key to party_halls)
    - Add `approval_status` (text) - pending, approved, rejected
    - Add `purpose` (text) - Purpose of booking
    - Add `admin_notes` (text) - Admin notes for rejection/approval
    - Add `approved_at` (timestamptz) - Timestamp of approval
    - Add `approved_by` (uuid) - Admin who approved (nullable)

  3. Security
    - Enable RLS on party_halls table
    - Public can view active halls
    - Admin can manage halls
    - Update booking policies to handle approval status

  4. Sample Data
    - Insert three party halls:
      1. Annamaye Hall (Poondi) - 9363009645
      2. Velan Hall (Poondi) - 9363009645
      3. Kandavel Mahal (Avinashi) - 9578789616
*/

-- Create party_halls table
CREATE TABLE IF NOT EXISTS party_halls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  phone text NOT NULL,
  maps_url text,
  capacity_min integer DEFAULT 50,
  capacity_max integer DEFAULT 500,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to party_hall_bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'party_hall_bookings' AND column_name = 'hall_id'
  ) THEN
    ALTER TABLE party_hall_bookings ADD COLUMN hall_id uuid REFERENCES party_halls(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'party_hall_bookings' AND column_name = 'approval_status'
  ) THEN
    ALTER TABLE party_hall_bookings ADD COLUMN approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'party_hall_bookings' AND column_name = 'purpose'
  ) THEN
    ALTER TABLE party_hall_bookings ADD COLUMN purpose text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'party_hall_bookings' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE party_hall_bookings ADD COLUMN admin_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'party_hall_bookings' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE party_hall_bookings ADD COLUMN approved_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'party_hall_bookings' AND column_name = 'approved_by'
  ) THEN
    ALTER TABLE party_hall_bookings ADD COLUMN approved_by uuid;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_party_halls_display_order ON party_halls(display_order);
CREATE INDEX IF NOT EXISTS idx_party_halls_is_active ON party_halls(is_active);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_hall_id ON party_hall_bookings(hall_id);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_approval_status ON party_hall_bookings(approval_status);
CREATE INDEX IF NOT EXISTS idx_party_hall_bookings_hall_date ON party_hall_bookings(hall_id, booking_date);

-- Enable Row Level Security
ALTER TABLE party_halls ENABLE ROW LEVEL SECURITY;

-- RLS Policies for party_halls
CREATE POLICY "Anyone can view active party halls"
  ON party_halls FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all party halls"
  ON party_halls FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert party halls"
  ON party_halls FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update party halls"
  ON party_halls FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete party halls"
  ON party_halls FOR DELETE
  TO authenticated
  USING (true);

-- Update RLS policies for party_hall_bookings to handle approval status
DROP POLICY IF EXISTS "Anyone can view available bookings" ON party_hall_bookings;

CREATE POLICY "Anyone can view approved bookings for availability"
  ON party_hall_bookings FOR SELECT
  USING (approval_status = 'approved');

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_party_halls_updated_at ON party_halls;
CREATE TRIGGER update_party_halls_updated_at
  BEFORE UPDATE ON party_halls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert the three party halls
INSERT INTO party_halls (name, location, phone, maps_url, capacity_min, capacity_max, display_order) VALUES
  ('Annamaye Hall', 'Poondi', '9363009645', 'https://maps.app.goo.gl/NaurS4tSzUu2jHZb6', 50, 300, 1),
  ('Velan Hall', 'Poondi', '9363009645', 'https://maps.app.goo.gl/UucpoTadP5PJmkrv9', 50, 250, 2),
  ('Kandavel Mahal', 'Avinashi', '9578789616', 'https://maps.app.goo.gl/HFeuvg7AT2yjQrXr7', 100, 500, 3)
ON CONFLICT DO NOTHING;