/*
  # Add Custom Display Duration to Food Review Videos

  1. Schema Changes
    - Add `custom_display_duration` column to food_review_videos table
      - Stores admin-defined duration in seconds for how long the card should display
      - Type: integer (seconds)
      - Default: NULL (uses actual video duration when NULL)
      - Constraint: Must be between 5 and 300 seconds (5 seconds to 5 minutes)
  
  2. Notes
    - When custom_display_duration is NULL, the carousel will use the video's actual duration
    - When custom_display_duration is set, the carousel advances after that many seconds
    - This allows admins to control card display time independent of video length
  
  3. Security
    - No changes to RLS policies (existing policies remain)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'food_review_videos' AND column_name = 'custom_display_duration'
  ) THEN
    ALTER TABLE food_review_videos 
    ADD COLUMN custom_display_duration integer CHECK (custom_display_duration IS NULL OR (custom_display_duration >= 5 AND custom_display_duration <= 300));
  END IF;
END $$;

COMMENT ON COLUMN food_review_videos.custom_display_duration IS 'Custom duration in seconds for how long this video card should display before advancing to next. NULL means use actual video duration.';

CREATE INDEX IF NOT EXISTS idx_food_review_videos_custom_duration 
  ON food_review_videos(custom_display_duration) WHERE custom_display_duration IS NOT NULL;