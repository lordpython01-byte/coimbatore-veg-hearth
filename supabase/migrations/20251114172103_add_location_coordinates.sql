/*
  # Add Latitude and Longitude to Locations

  1. Changes
    - Add `latitude` (numeric) - Latitude coordinate for map pin
    - Add `longitude` (numeric) - Longitude coordinate for map pin
    
  2. Notes
    - Coordinates are optional and can be null
    - Used for displaying location pins on interactive maps
    - Admins can set these via map picker in admin panel
*/

-- Add latitude and longitude columns to locations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locations' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE locations ADD COLUMN latitude numeric(10, 8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locations' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE locations ADD COLUMN longitude numeric(11, 8);
  END IF;
END $$;

-- Create index for geospatial queries
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;