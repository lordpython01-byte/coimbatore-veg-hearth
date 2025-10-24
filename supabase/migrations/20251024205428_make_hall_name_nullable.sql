/*
  # Make hall_name nullable in party_hall_bookings

  1. Changes
    - Make hall_name column nullable since we now use hall_id foreign key
    - This allows the system to use the relationship instead of duplicating the hall name

  2. Notes
    - The hall name can be retrieved via the party_halls relationship
    - Existing bookings will keep their hall_name values
    - New bookings will rely on the hall_id foreign key
*/

-- Make hall_name nullable
DO $$
BEGIN
  ALTER TABLE party_hall_bookings ALTER COLUMN hall_name DROP NOT NULL;
END $$;