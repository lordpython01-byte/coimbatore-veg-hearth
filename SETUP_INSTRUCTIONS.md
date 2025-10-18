# Setup Instructions

## What's Been Implemented

### 1. Fixed Supabase Integration
- Supabase client is properly configured
- Environment variables are set up correctly

### 2. Database Schema Created
The following tables have been created in your Supabase database:
- `menu_items` - Restaurant menu management
- `locations` - Restaurant branch locations
- `customer_reviews` - Customer feedback and ratings
- `food_review_videos` - Tamil food review videos
- `party_hall_bookings` - Party hall reservations

### 3. Admin Panel Features
A complete admin panel with the following capabilities:

#### Menu Management
- Add, edit, delete menu items
- Set prices, descriptions, categories
- Upload images
- Toggle availability
- Set display order

#### Location Management
- Add, edit, delete restaurant locations
- Set operating hours
- Add contact information (phone, email)
- Google Maps integration
- Toggle active/inactive status

#### Review Management
- View all customer reviews
- Approve or reject reviews
- Delete inappropriate reviews
- See ratings and timestamps

#### Video Review Management
- Add, edit, delete video reviews
- Support for Tamil reviewer names
- Direct video file URLs (MP4, WebM, OGG)
- Toggle active/inactive status
- Set display order in carousel

#### Party Hall Booking Management
- View all bookings
- Add, edit, delete bookings
- Update booking status (Booked, Available, Cancelled)
- Track customer details
- Manage event information

## Quick Start

### Step 1: Create Admin User
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** > **Users**
4. Click **Add User**
5. Enter email: `admin@yourdomain.com`
6. Enter a strong password
7. Click **Create User**

### Step 2: Access Admin Panel
1. Navigate to: `http://your-domain.com/admin/login`
2. Login with the credentials created above
3. You'll be redirected to the admin dashboard

### Step 3: Add Content
Start adding content in this order:
1. **Locations** - Add your restaurant branches
2. **Menu Items** - Add dishes with images and prices
3. **Video Reviews** - Add Tamil food review videos
4. **Approve Reviews** - As customers submit reviews, approve them

### Step 4: Manage Bookings
- Monitor party hall bookings
- Update booking status as dates pass
- Keep track of customer information

## Important Notes

### Security
- All admin operations require authentication
- Public users can only view approved/active content
- Row Level Security (RLS) is enabled on all tables

### Video Files
- Videos must be direct file URLs (not YouTube/Instagram)
- Supported formats: MP4, WebM, OGG
- Upload videos to Supabase Storage or use a CDN
- Keep video files optimized for web (compress if needed)

### Image Files
- Upload images to Supabase Storage for better performance
- Use appropriate image sizes (optimize before uploading)
- Recommended formats: JPG, PNG, WebP

## Admin Panel Routes
- Login: `/admin/login`
- Dashboard: `/admin`

## Database Migrations
All migrations are located in: `supabase/migrations/`

If you need to run migrations manually:
1. Go to Supabase Dashboard > SQL Editor
2. Copy the SQL from the migration files
3. Execute in the SQL Editor

## Support & Documentation
- See `ADMIN_PANEL_GUIDE.md` for detailed admin panel documentation
- See `VIDEO_REVIEWS_GUIDE.md` for video review setup instructions

## Troubleshooting

### Can't Login to Admin Panel
- Verify user exists in Supabase Authentication
- Check that email/password are correct
- Ensure `.env` file has correct Supabase credentials

### Content Not Appearing
- Check that items are marked as "active" or "available"
- Verify reviews are approved
- Confirm display_order values are set

### Videos Not Playing
- Ensure video URLs are direct file links
- Check video format is MP4, WebM, or OGG
- Verify video file is accessible (not behind authentication)
