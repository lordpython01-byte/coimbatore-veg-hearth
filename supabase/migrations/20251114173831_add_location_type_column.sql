/*
  # Add location type column

  1. Changes
    - Add `type` column to locations table with values: 'Kitchen', 'Party Hall', or 'Restaurant'
    - Update existing locations with appropriate types based on their names
    - Set default value for new locations

  2. Notes
    - This allows admins to explicitly set location types instead of inferring from names
    - Improves filtering and display accuracy
*/

-- Add type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'locations' AND column_name = 'type'
  ) THEN
    ALTER TABLE locations ADD COLUMN type text DEFAULT 'Restaurant';
  END IF;
END $$;

-- Add check constraint for valid types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE constraint_name = 'locations_type_check'
  ) THEN
    ALTER TABLE locations ADD CONSTRAINT locations_type_check 
      CHECK (type IN ('Kitchen', 'Party Hall', 'Restaurant'));
  END IF;
END $$;

-- Update existing locations with appropriate types
UPDATE locations SET type = 'Kitchen' WHERE name ILIKE '%kitchen%';
UPDATE locations SET type = 'Party Hall' WHERE name ILIKE '%hall%' OR name ILIKE '%mahal%';
UPDATE locations SET type = 'Restaurant' WHERE type IS NULL OR (name ILIKE '%restaurant%' OR name NOT ILIKE '%kitchen%' AND name NOT ILIKE '%hall%' AND name NOT ILIKE '%mahal%');

-- Verify the changes
SELECT name, type FROM locations ORDER BY display_order;