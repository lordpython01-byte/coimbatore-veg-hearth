/*
  # Add Video Upload Fields to Food Review Videos Table

  1. Schema Changes
    - Add `video_type` column to food_review_videos table
      - Values: 'local' or 'youtube'
      - Default: 'youtube' for backward compatibility
    - Add `file_size` column to store video file size in bytes
    - Add `video_duration` column to store video length in seconds
    - Add `original_filename` column to store original uploaded file name
  
  2. Security
    - No changes to RLS policies (existing policies remain)
  
  3. Notes
    - This migration is backward compatible with existing YouTube URLs
    - Local videos will be stored in /public/assets/videos/ folder
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'food_review_videos' AND column_name = 'video_type'
  ) THEN
    ALTER TABLE food_review_videos 
    ADD COLUMN video_type text DEFAULT 'youtube' CHECK (video_type IN ('local', 'youtube'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'food_review_videos' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE food_review_videos 
    ADD COLUMN file_size bigint;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'food_review_videos' AND column_name = 'video_duration'
  ) THEN
    ALTER TABLE food_review_videos 
    ADD COLUMN video_duration integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'food_review_videos' AND column_name = 'original_filename'
  ) THEN
    ALTER TABLE food_review_videos 
    ADD COLUMN original_filename text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_food_review_videos_video_type 
  ON food_review_videos(video_type);