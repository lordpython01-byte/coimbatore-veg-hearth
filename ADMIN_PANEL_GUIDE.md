# Admin Panel Guide

## Overview
The admin panel provides a comprehensive interface to manage all aspects of the restaurant website including menu items, locations, reviews, video reviews, and party hall bookings.

## Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Login with your Supabase admin credentials
3. After successful login, you'll be redirected to the admin dashboard

## Creating an Admin User

You need to create a user in Supabase to access the admin panel:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Enter email and password
5. Use these credentials to login to the admin panel

## Admin Dashboard Features

### 1. Menu Management
- **Add Menu Items**: Create new dishes with name, description, price, category, and image
- **Edit Menu Items**: Update existing menu items
- **Delete Menu Items**: Remove items from the menu
- **Toggle Availability**: Mark items as available or unavailable
- **Set Display Order**: Control the order in which items appear

**Categories Available:**
- Breakfast
- Lunch
- Dinner
- Snacks
- Beverages
- Main Course

### 2. Location Management
- **Add Locations**: Create new restaurant branches
- **Edit Locations**: Update location details
- **Delete Locations**: Remove locations
- **Set Operating Hours**: Define opening and closing times
- **Map Integration**: Add Google Maps embed URLs
- **Toggle Active Status**: Enable/disable locations

**Location Details:**
- Name
- Full Address
- City
- Phone Number
- Email
- Map URL
- Opening/Closing Times
- Display Order

### 3. Review Management
- **View All Reviews**: See all customer reviews (approved and pending)
- **Approve Reviews**: Approve reviews to display on the website
- **Unapprove Reviews**: Hide approved reviews
- **Delete Reviews**: Remove inappropriate reviews
- **Rating Display**: View customer ratings (1-5 stars)

**Note:** Only approved reviews appear on the public website.

### 4. Video Review Management
- **Add Video Reviews**: Upload Tamil food review videos
- **Edit Video Reviews**: Update reviewer information and video URLs
- **Delete Video Reviews**: Remove videos
- **Toggle Active Status**: Show/hide videos
- **Set Display Order**: Control carousel order

**Video Requirements:**
- Use direct video file URLs (MP4, WebM, OGG)
- Upload videos to Supabase Storage or use CDN URLs
- Include reviewer name (can be in Tamil)
- Include reviewer role/description

### 5. Party Hall Booking Management
- **View All Bookings**: See all party hall bookings
- **Add Bookings**: Create new booking entries
- **Edit Bookings**: Update booking details
- **Delete Bookings**: Remove bookings
- **Update Status**: Change booking status (Booked, Available, Cancelled)
- **View Details**: See customer contact info, event details, and guest count

**Booking Information:**
- Hall Name
- Customer Name
- Phone & Email
- Booking Date
- Event Type
- Guest Count
- Status
- Notes

**Status Options:**
- **Booked**: Hall is reserved for a specific date
- **Available**: Hall is free for booking
- **Cancelled**: Booking was cancelled

## Database Tables

All data is stored in Supabase with the following tables:

1. `menu_items` - Restaurant menu items
2. `locations` - Restaurant branches
3. `customer_reviews` - Customer feedback and ratings
4. `food_review_videos` - Tamil food review videos
5. `party_hall_bookings` - Party hall reservations

## Security

- All admin operations require authentication
- Row Level Security (RLS) is enabled on all tables
- Public users can only view approved/active content
- Only authenticated users can modify data

## Tips

1. **Images**: Host images on Supabase Storage or use CDN URLs for better performance
2. **Display Order**: Use display_order field to control the sequence of items
3. **Regular Reviews**: Check and approve customer reviews regularly
4. **Booking Updates**: Update booking status as dates pass to keep data current
5. **Video Files**: Use compressed video files to ensure fast loading times

## Support

For technical issues or questions about the admin panel, contact your development team.
