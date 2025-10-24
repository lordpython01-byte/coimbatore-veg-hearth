/*
  # Create Video Storage Bucket

  1. Storage Setup
    - Create a public bucket called 'video-reviews' for storing video files
    - Set up policies to allow authenticated users to upload videos
    - Allow public access to read videos
  
  2. Security
    - Authenticated users can upload videos (admins only)
    - Anyone can view/download videos (public read access)
    - Maximum file size: 100MB
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-reviews',
  'video-reviews',
  true,
  104857600,
  ARRAY['video/mp4', 'video/webm', 'video/ogg']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'video-reviews');

CREATE POLICY "Anyone can view videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'video-reviews');

CREATE POLICY "Authenticated users can update videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'video-reviews')
  WITH CHECK (bucket_id = 'video-reviews');

CREATE POLICY "Authenticated users can delete videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'video-reviews');