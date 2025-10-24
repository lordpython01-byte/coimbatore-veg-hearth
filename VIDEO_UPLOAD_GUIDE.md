# Video Upload System Guide

## Overview

The video upload system has been updated to use **Supabase Storage** for reliable video file storage and management.

## How It Works

### For Admins

1. **Navigate to Videos Tab** in the Admin Dashboard
2. **Click "Add Video"** or edit an existing video
3. **Choose Upload Method**:
   - **Upload Video**: Upload video files directly (MP4, WebM, OGG)
   - **YouTube URL**: Use YouTube Shorts or regular YouTube links

### Video Upload Process

When you upload a video file:

1. **File Selection**: Choose a video file from your computer
   - Maximum file size: 100MB
   - Supported formats: MP4, WebM, OGG

2. **Preview**: The video preview appears immediately with file size information

3. **Metadata Extraction**: The system attempts to extract video duration automatically
   - This happens in the background
   - If it fails, the upload continues without duration info

4. **Upload to Supabase Storage**:
   - Click "Save Video Review"
   - The file is uploaded to Supabase Storage bucket `video-reviews`
   - Progress bar shows upload status
   - A public URL is generated and stored in the database

5. **Success**: The video is now saved and will appear on the public website

### Video Management

- **Copy Path**: Click the copy button to copy the video URL
- **Edit**: Modify reviewer name, role, or video
- **Delete**: Remove the video (also deletes from storage)
- **Active/Inactive**: Toggle video visibility on the public site

## Storage Information

### Supabase Storage Bucket

- **Bucket Name**: `video-reviews`
- **Access**: Public read, authenticated write
- **File Size Limit**: 100MB per file
- **Allowed Types**: video/mp4, video/webm, video/ogg

### Database Fields

- `video_url`: Full public URL to the video file
- `video_type`: 'local' for uploaded videos, 'youtube' for YouTube links
- `file_size`: Size of the video file in bytes
- `video_duration`: Length of video in seconds
- `original_filename`: Original name of the uploaded file

## Public Video Display

### Video Player Controls

When users view videos on the public site:

- **Hover Controls**: Pause/play and mute/unmute buttons appear on hover
- **Auto-play**: Center video plays automatically (muted)
- **Auto-hide**: Controls disappear after 3 seconds of inactivity

### Video Types

- **Local Videos**: Uploaded files from Supabase Storage
- **YouTube Videos**: Embedded YouTube Shorts or regular videos

## Troubleshooting

### Upload Fails

If video upload fails:
1. Check file size (must be under 100MB)
2. Verify file format (MP4, WebM, or OGG)
3. Ensure stable internet connection
4. Check Supabase Storage quota

### Metadata Extraction Fails

If "Failed to read video metadata" appears:
- This is a warning, not an error
- The upload will still work
- Duration will be 0 in the database
- The video will play normally on the website

### Video Doesn't Play

If uploaded video doesn't play:
1. Verify the video_url field contains a valid Supabase Storage URL
2. Check that the video file is accessible (public bucket)
3. Try re-uploading the video

## Technical Details

### Upload Flow

1. File validated (size, type)
2. File uploaded to Supabase Storage bucket
3. Public URL retrieved
4. Database record created/updated with video metadata
5. Cache invalidated to show new video

### File Naming

Videos are stored with timestamps to prevent conflicts:
```
video-{timestamp}-{sanitized-filename}.{extension}
```

Example: `video-1234567890-my_video.mp4`

## Security

- Only authenticated admin users can upload videos
- All videos are publicly accessible once uploaded
- Row Level Security (RLS) policies protect database operations
- Storage policies control upload/delete permissions
