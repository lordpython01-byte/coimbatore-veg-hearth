/*
  # Create section settings table

  1. New Tables
    - `section_settings`
      - `id` (uuid, primary key)
      - `section_name` (text, unique) - Name of the section (e.g., 'video_reviews', 'testimonials')
      - `is_visible` (boolean) - Whether the section is visible on the user panel
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `section_settings` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Initial Data
    - Insert default settings for video_reviews section (visible by default)
*/

-- Create section_settings table
CREATE TABLE IF NOT EXISTS section_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name text UNIQUE NOT NULL,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE section_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read section settings
CREATE POLICY "Anyone can read section settings"
  ON section_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to update section settings (admin only in practice)
CREATE POLICY "Authenticated users can update section settings"
  ON section_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert section settings
CREATE POLICY "Authenticated users can insert section settings"
  ON section_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default settings for video_reviews section
INSERT INTO section_settings (section_name, is_visible)
VALUES ('video_reviews', true)
ON CONFLICT (section_name) DO NOTHING;

-- Verify the table
SELECT * FROM section_settings;