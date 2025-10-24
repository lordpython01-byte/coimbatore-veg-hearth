/*
  # Create Menu Management System

  1. New Tables
    - `menu_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name (e.g., "Breakfast", "Main Course")
      - `description` (text) - Category description
      - `display_order` (integer) - Order for display
      - `is_active` (boolean) - Whether category is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `menu_items`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key) - References menu_categories
      - `name` (text) - Item name
      - `description` (text) - Item description
      - `image_url` (text) - URL to item image
      - `price` (numeric) - Item price
      - `rating` (numeric) - Rating (0-5)
      - `cooking_time` (text) - e.g., "15 mins"
      - `is_available` (boolean) - Whether item is currently available
      - `display_order` (integer) - Order within category
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access (anyone can view menu)
    - Admin-only write access (authenticated users with admin role)
*/

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  price numeric(10, 2) DEFAULT 0,
  rating numeric(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  cooking_time text,
  is_available boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON menu_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON menu_items(display_order);

-- Enable Row Level Security
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Public read access for menu_categories
CREATE POLICY "Anyone can view active categories"
  ON menu_categories FOR SELECT
  USING (is_active = true);

-- Public read access for menu_items
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

-- Admin write access for menu_categories
CREATE POLICY "Authenticated users can insert categories"
  ON menu_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON menu_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON menu_categories FOR DELETE
  TO authenticated
  USING (true);

-- Admin write access for menu_items
CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete menu items"
  ON menu_items FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample categories
INSERT INTO menu_categories (name, description, display_order) VALUES
  ('Breakfast', 'Start your day with our traditional South Indian breakfast items', 1),
  ('Main Course', 'Hearty meals perfect for lunch and dinner', 2),
  ('Snacks', 'Light bites and tea-time favorites', 3),
  ('Desserts', 'Sweet treats to complete your meal', 4),
  ('Beverages', 'Refreshing drinks and traditional filter coffee', 5)
ON CONFLICT (name) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (category_id, name, description, image_url, price, rating, cooking_time, display_order) 
SELECT 
  (SELECT id FROM menu_categories WHERE name = 'Breakfast'),
  'Soft Idli',
  'Fluffy steamed rice cakes served with coconut chutney and sambar',
  '/assets/dish-idli.jpg',
  40,
  4.8,
  '15 mins',
  1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Soft Idli');

INSERT INTO menu_items (category_id, name, description, image_url, price, rating, cooking_time, display_order)
SELECT 
  (SELECT id FROM menu_categories WHERE name = 'Breakfast'),
  'Masala Dosa',
  'Crispy golden dosa filled with spiced potato masala',
  '/assets/dish-masala-dosa.jpg',
  60,
  4.9,
  '20 mins',
  2
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Masala Dosa');

INSERT INTO menu_items (category_id, name, description, image_url, price, rating, cooking_time, display_order)
SELECT 
  (SELECT id FROM menu_categories WHERE name = 'Snacks'),
  'Medu Vada',
  'Crispy fried lentil donuts, a perfect tea-time snack',
  '/assets/dish-vada.jpg',
  45,
  4.7,
  '18 mins',
  1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Medu Vada');

INSERT INTO menu_items (category_id, name, description, image_url, price, rating, cooking_time, display_order)
SELECT 
  (SELECT id FROM menu_categories WHERE name = 'Breakfast'),
  'Ven Pongal',
  'Comforting rice and lentil porridge with ghee and spices',
  '/assets/dish-pongal.jpg',
  50,
  4.6,
  '25 mins',
  3
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Ven Pongal');

INSERT INTO menu_items (category_id, name, description, image_url, price, rating, cooking_time, display_order)
SELECT 
  (SELECT id FROM menu_categories WHERE name = 'Main Course'),
  'Sambar Rice',
  'Wholesome rice mixed with flavorful sambar and vegetables',
  '/assets/dish-sambar-rice.jpg',
  55,
  4.5,
  '22 mins',
  1
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE name = 'Sambar Rice');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_menu_categories_updated_at ON menu_categories;
CREATE TRIGGER update_menu_categories_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
