# Video Upload System Guide - cPanel Hosting

## Overview

The video upload system is designed for cPanel hosting with 25GB storage. Videos are stored in the `/public/assets/videos/` folder and referenced by path in the database.

## How It Works

### For Admins

1. **Navigate to Videos Tab** in the Admin Dashboard
2. **Click "Add Video"** or edit an existing video
3. **Choose Upload Method**:
   - **Upload Video**: Upload video files directly (MP4, WebM, OGG)
   - **YouTube URL**: Use YouTube Shorts or regular YouTube links

### Video Upload Process (For Local Files)

#### Step 1: Select Video in Admin Panel

1. Click "Upload Video" tab
2. Click "Choose Video File" button
3. Select your video file (max 100MB)
   - Supported formats: MP4, WebM, OGG

#### Step 2: File Preparation

When you select a file:
- Preview appears immediately
- File metadata is extracted (size, duration)
- **File is automatically downloaded** with a timestamp name
  - Example: `video-1698765432-my_video.mp4`

#### Step 3: Save Entry in Database

1. Click "Save Video Review"
2. A notification appears with the exact filename to upload
3. The database entry is created with the file path: `/assets/videos/filename.mp4`

#### Step 4: Manual Upload to cPanel

**IMPORTANT**: You must manually upload the video file to your server:

1. **Login to your cPanel**
2. Go to **File Manager**
3. Navigate to `/public/assets/videos/`
4. Click **Upload**
5. Upload the downloaded video file
6. **Keep the exact filename** (including timestamp)

#### Step 5: Verify

- Refresh your website
- The video will now play correctly

### Video Management

- **Copy Path**: Click the copy button to copy the video URL
- **Edit**: Modify reviewer name, role, or video
- **Delete**: Remove the video (also deletes from storage)
- **Active/Inactive**: Toggle video visibility on the public site

### Deleting Videos

When you delete a video:
- Database entry is removed immediately
- **Manual cleanup needed**: Delete the actual file from `/public/assets/videos/` via cPanel File Manager

### Active/Inactive Toggle

- Active videos appear on the public website
- Inactive videos are hidden but remain in the database
- File stays on server regardless of active status

## File Management Best Practices

### cPanel File Organization

Your video files location:
```
public/
  └── assets/
      └── videos/
          ├── video-1698765432-review1.mp4
          ├── video-1698765789-review2.mp4
          └── video-1698766123-review3.webm
```

### Storage Management

With 25GB cPanel storage:
- Average video size: 5-10MB
- Estimated capacity: 2,500-5,000 videos
- Monitor storage usage in cPanel

### Cleanup Old Videos

To free up space:
1. Mark videos as inactive in admin panel
2. Verify they're no longer needed
3. Delete from database in admin panel
4. Manually delete files from `/public/assets/videos/` in cPanel

## Database Fields

- `video_url`: Path like `/assets/videos/filename.mp4`
- `video_type`: `'local'` for uploaded files, `'youtube'` for YouTube
- `file_size`: Size in bytes
- `video_duration`: Duration in seconds
- `original_filename`: Original upload name

## Troubleshooting

### Video Doesn't Play

**Problem**: Video shows in admin but doesn't play on website

**Solutions**:
1. Verify the file was uploaded to `/public/assets/videos/`
2. Check the filename matches exactly (case-sensitive)
3. Ensure file has correct permissions (644)
4. Clear browser cache

### File Not Found Error

**Problem**: 404 error when playing video

**Solutions**:
1. Confirm file exists in `/public/assets/videos/`
2. Check database path matches: `/assets/videos/filename.mp4`
3. Verify filename spelling (timestamps must match)

### Upload Fails in Admin Panel

**Problem**: Error when saving video entry

**Solutions**:
1. Check file size (must be under 100MB)
2. Verify file format (MP4, WebM, or OGG only)
3. Try a different browser
4. Check browser console for specific errors

### Video File Too Large

If your video exceeds 100MB:

1. **Compress the video**:
   - Use tools like HandBrake, FFmpeg, or online compressors
   - Reduce resolution (e.g., 1080p to 720p)
   - Lower bitrate

2. **Use YouTube instead**:
   - Upload to YouTube as unlisted/public
   - Use YouTube URL in admin panel
   - No storage used on your server

## Technical Details

### File Naming Convention

```
video-{timestamp}-{sanitized-filename}.{extension}
```

- Timestamp: Unix timestamp in milliseconds
- Sanitized: Only letters, numbers, dots, dashes, underscores
- Example: `video-1698765432123-masala_dosa_review.mp4`

### Public Video Paths

Videos are accessed via:
```
https://yourdomain.com/assets/videos/video-1698765432-review.mp4
```

## Quick Reference

### Adding a Local Video

1. Admin Panel → Videos → Add Video
2. Select file → Gets downloaded automatically
3. Save entry in admin panel (note the filename)
4. cPanel → File Manager → `/public/assets/videos/`
5. Upload the downloaded file with exact filename

### Adding a YouTube Video

1. Admin Panel → Videos → Add Video
2. Switch to "YouTube URL" tab
3. Paste URL → Save
4. Done (no file upload needed)

### Deleting a Video

1. Admin Panel → Videos → Click Delete
2. cPanel → File Manager → `/public/assets/videos/`
3. Delete the video file manually

## Support

If you encounter issues:
1. Check this guide first
2. Verify file paths and names match exactly
3. Check cPanel error logs
4. Clear browser cache
5. Test in incognito/private mode
