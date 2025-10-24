/*
  # Create Gallery Table

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key)
      - `image_url` (text) - Web URL to the image
      - `alt_text` (text) - Alternative text for accessibility
      - `title` (text) - Optional title for the image
      - `display_order` (integer) - Order for displaying images
      - `span_class` (text) - CSS grid span class for layout
      - `is_active` (boolean) - Whether image is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on gallery_images table
    - Public can view active images
    - Admin (via anon key) can manage all images

  3. Notes
    - Images should use web URLs from CDN services
    - span_class helps control grid layout (e.g., "md:col-span-2 md:row-span-2")
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  alt_text text NOT NULL,
  title text,
  display_order integer DEFAULT 0,
  span_class text DEFAULT 'md:col-span-1 md:row-span-1',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gallery images"
  ON gallery_images FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow anon select all gallery images"
  ON gallery_images FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert gallery images"
  ON gallery_images FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update gallery images"
  ON gallery_images FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete gallery images"
  ON gallery_images FOR DELETE
  TO anon
  USING (true);

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO gallery_images (image_url, alt_text, title, display_order, span_class) VALUES
  ('https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80', 'Masala Dosa', 'Crispy Masala Dosa', 1, 'md:col-span-2 md:row-span-2'),
  ('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80', 'Soft Idli', 'Steamed Soft Idli', 2, 'md:col-span-1 md:row-span-1'),
  ('https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80', 'Medu Vada', 'Crispy Vada', 3, 'md:col-span-1 md:row-span-1'),
  ('https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80', 'Ven Pongal', 'Traditional Pongal', 4, 'md:col-span-1 md:row-span-2'),
  ('https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&q=80', 'Sambar Rice', 'Flavorful Sambar Rice', 5, 'md:col-span-1 md:row-span-1'),
  ('https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&q=80', 'Filter Coffee', 'South Indian Filter Coffee', 6, 'md:col-span-1 md:row-span-1')
ON CONFLICT DO NOTHING;
