const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export const validateVideoFile = (file: File): string | null => {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return 'Invalid video format. Please upload MP4, WebM, or OGG files.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`;
  }

  return null;
};

export const getVideoMetadata = (file: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Video metadata loading timeout'));
    }, 10000);

    const cleanup = () => {
      clearTimeout(timeout);
      if (video.src) {
        URL.revokeObjectURL(video.src);
      }
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      const duration = video.duration && isFinite(video.duration) ? Math.round(video.duration) : 0;
      const width = video.videoWidth || 0;
      const height = video.videoHeight || 0;

      cleanup();
      resolve({
        duration,
        width,
        height,
      });
    };

    video.onerror = (e) => {
      cleanup();
      console.error('Video metadata error:', e);
      reject(new Error('Failed to load video metadata'));
    };

    try {
      const blobUrl = URL.createObjectURL(file);
      video.src = blobUrl;
      video.load();
    } catch (error) {
      cleanup();
      reject(new Error('Failed to create video URL'));
    }
  });
};

export const downloadVideoFile = (file: File): string => {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `video-${timestamp}-${sanitizedName}`;

  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return filename;
};

export const getVideoFileName = (file: File): string => {
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `video-${timestamp}-${sanitizedName}`;
};

export const getVideoPath = (filename: string): string => {
  return `/assets/videos/${filename}`;
};

export const deleteVideoFile = async (videoPath: string): Promise<void> => {
  if (!videoPath.startsWith('/assets/videos/')) {
    return;
  }

  try {
    await fetch('/api/delete-video', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoPath }),
    });
  } catch (error) {
    console.error('Delete error:', error);
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
