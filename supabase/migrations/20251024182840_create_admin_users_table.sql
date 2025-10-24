/*
  # Create Admin Users Table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Admin email/username
      - `password_hash` (text) - Hashed password
      - `full_name` (text) - Admin's full name
      - `is_active` (boolean) - Whether admin account is active
      - `last_login` (timestamptz) - Last login timestamp
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on admin_users table
    - Only authenticated admins can read their own data
    - No public access

  3. Initial Data
    - Create admin user: admin@annamaye.com with password: Admin@annamaye_2146
    - Password is stored as bcrypt hash
*/

-- Create extension for password hashing if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies - No public access, admin can only read their own data
CREATE POLICY "Admins can read own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Function to verify admin password
CREATE OR REPLACE FUNCTION verify_admin_password(
  admin_email text,
  admin_password text
)
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  is_active boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.full_name,
    au.is_active
  FROM admin_users au
  WHERE au.email = admin_email
    AND au.password_hash = crypt(admin_password, au.password_hash)
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update last login timestamp
CREATE OR REPLACE FUNCTION update_admin_last_login(admin_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE admin_users
  SET last_login = now()
  WHERE id = admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default admin user
-- Password: Admin@annamaye_2146
INSERT INTO admin_users (email, password_hash, full_name, is_active)
VALUES (
  'admin@annamaye.com',
  crypt('Admin@annamaye_2146', gen_salt('bf')),
  'Annamaye Admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
