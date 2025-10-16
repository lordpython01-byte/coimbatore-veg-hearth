/*
  # Create Food Review Videos Table

  1. New Tables
    - `food_review_videos`
      - `id` (uuid, primary key)
      - `reviewer_name` (text) - Name of the person reviewing
      - `reviewer_role` (text) - Role/description of the reviewer
      - `video_url` (text) - YouTube Shorts or Instagram Reels URL
      - `thumbnail_url` (text, optional) - Custom thumbnail if needed
      - `display_order` (integer) - Order to display videos
      - `is_active` (boolean) - Whether to show this video
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `food_review_videos` table
    - Add policy for public read access (videos are public content)
    - Add policy for authenticated insert/update/delete
*/

CREATE TABLE IF NOT EXISTS food_review_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name text NOT NULL,
  reviewer_role text NOT NULL DEFAULT 'Food Reviewer',
  video_url text NOT NULL,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE food_review_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active food review videos"
  ON food_review_videos
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert food review videos"
  ON food_review_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update food review videos"
  ON food_review_videos
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete food review videos"
  ON food_review_videos
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_food_review_videos_display_order 
  ON food_review_videos(display_order);

CREATE INDEX IF NOT EXISTS idx_food_review_videos_is_active 
  ON food_review_videos(is_active);