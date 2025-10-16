# Tamil Food Video Reviews Guide

## Overview
The video review section displays Tamil food review videos from YouTube Shorts or Instagram Reels in a beautiful stacked card carousel design.

## Adding Video Reviews

### Using the Database Directly

You can add video reviews by inserting data into the `food_review_videos` table in your Supabase database:

```sql
INSERT INTO food_review_videos (reviewer_name, reviewer_role, video_url, display_order) VALUES
('முருகன்', 'Food Vlogger', 'https://youtube.com/shorts/VIDEO_ID', 1);
```

### Supported Video URL Formats

1. **YouTube Shorts:**
   - `https://youtube.com/shorts/VIDEO_ID`
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`

2. **Instagram Reels:**
   - `https://www.instagram.com/reel/REEL_ID`

### Video Properties

- `reviewer_name`: The name of the reviewer (can be in Tamil)
- `reviewer_role`: Their role or description (e.g., "Food Blogger", "Regular Customer")
- `video_url`: The full URL of the YouTube Short or Instagram Reel
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
