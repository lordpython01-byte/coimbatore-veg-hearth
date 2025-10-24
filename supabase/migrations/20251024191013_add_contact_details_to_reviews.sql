/*
  # Add Contact Details to Customer Reviews

  1. Changes
    - Add `email` column to customer_reviews table
    - Add `location` column to customer_reviews table
    - Add `phone` column to customer_reviews table (optional)
  
  2. Notes
    - Email and location are required for better contact tracking
    - Phone is optional for additional contact method
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_reviews' AND column_name = 'email'
  ) THEN
    ALTER TABLE customer_reviews ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_reviews' AND column_name = 'location'
  ) THEN
    ALTER TABLE customer_reviews ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'customer_reviews' AND column_name = 'phone'
  ) THEN
    ALTER TABLE customer_reviews ADD COLUMN phone text;
  END IF;
END $$;
