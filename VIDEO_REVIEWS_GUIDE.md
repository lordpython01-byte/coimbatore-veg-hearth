# Tamil Food Video Reviews Guide

## Overview
The video review section displays Tamil food review videos in a beautiful stacked card carousel design with auto-play functionality.

## Adding Video Reviews

### Using the Database Directly

You can add video reviews by inserting data into the `food_review_videos` table in your Supabase database:

```sql
INSERT INTO food_review_videos (reviewer_name, reviewer_role, video_url, display_order) VALUES
('முருகன்', 'Food Vlogger', '/src/assets/my-video.mp4', 1);
```

### Supported Video Formats

**Direct Video Files (Recommended):**
- MP4 files (`.mp4`)
- WebM files (`.webm`)
- OGG files (`.ogg`)

Upload your video files to:
- `/src/assets/` directory in your project
- Or use a CDN/cloud storage URL (e.g., Supabase Storage, Cloudinary)

**Example URLs:**
- Local files: `/src/assets/review-video.mp4`
- CDN: `https://your-cdn.com/videos/review.mp4`
- Supabase Storage: `https://your-project.supabase.co/storage/v1/object/public/videos/review.mp4`

**Note:** YouTube and Instagram videos cannot be embedded due to their embed restrictions. Use direct video file URLs instead.

### Recommended: Use Supabase Storage

1. Go to your Supabase Dashboard > Storage
2. Create a public bucket called `food-review-videos`
3. Upload your video files
4. Copy the public URL and use it in the database

### Video Properties

- `reviewer_name`: The name of the reviewer (can be in Tamil)
- `reviewer_role`: Their role or description (e.g., "Food Blogger", "Regular Customer")
- `video_url`: The full URL to the video file (MP4, WebM, or OGG)
- `display_order`: Number to control the order of videos (lower numbers appear first)
- `is_active`: Boolean to show/hide the video (default: true)

## Features

- **Auto-play**: Videos automatically play when they come into focus
- **Stacked Card Design**: Beautiful 3D carousel effect with vertical text labels
- **Auto-rotation**: Cards automatically rotate every 5 seconds
- **Manual Navigation**: Click the dots below to jump to specific videos
- **Responsive**: Works on mobile and desktop devices

## Design Elements

- Vertical reviewer name on the left side of each card
- Gradient overlay at the bottom showing reviewer info
- Smooth 3D transitions between cards
- Shadow and depth effects for premium feel
