import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VideoReview {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  video_url: string;
  thumbnail_url?: string;
  display_order: number;
  video_type?: 'local' | 'youtube';
  custom_display_duration?: number | null;
  video_duration?: number;
}

const VideoReviews = () => {
  const { data: videoReviews = [], isLoading } = useQuery({
    queryKey: ['food-review-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_review_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as VideoReview[];
    },
  });

  const [centerIndex, setCenterIndex] = useState(0);
  const [canAutoAdvance, setCanAutoAdvance] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  const handleVideoEnd = () => {
    setCanAutoAdvance(true);
  };

  const handleVideoStart = () => {
    setCanAutoAdvance(false);
  };

  useEffect(() => {
    if (!canAutoAdvance || videoReviews.length === 0) return;

    const timeout = setTimeout(() => {
      setCenterIndex((prev) => (prev + 1) % videoReviews.length);
      setCanAutoAdvance(false);
      setTimeRemaining(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [canAutoAdvance, videoReviews.length]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (videoReviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden relative z-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">
              Tamil Food Reviews
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Watch Our Video Reviews
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            See what Tamil food bloggers and customers say about our authentic South Indian cuisine
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-[600px] isolate">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            {videoReviews.map((review, index) => {
              const position = (index - centerIndex + videoReviews.length) % videoReviews.length;
              return (
                <VideoCard
                  key={review.id}
                  review={review}
                  position={position}
                  totalCards={videoReviews.length}
                  isCenter={position === 0}
                  onVideoEnd={handleVideoEnd}
                  onVideoStart={handleVideoStart}
                  onCardChange={() => setCenterIndex(index)}
                  onTimeUpdate={(remaining) => setTimeRemaining(remaining)}
                />
              );
            })}
          </div>
        </div>

        {timeRemaining > 0 && (
          <div className="flex justify-center mt-4">
            <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-accent/20 shadow-lg">
              <p className="text-sm text-muted-foreground">
                Next video in <span className="font-bold text-accent">{timeRemaining}s</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8 gap-2">
          {videoReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCenterIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === centerIndex
                  ? 'bg-accent w-8'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to video ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoCard = ({
  review,
  position,
  totalCards,
  isCenter,
  onVideoEnd,
  onVideoStart,
  onCardChange,
  onTimeUpdate
}: {
  review: VideoReview;
  position: number;
  totalCards: number;
  isCenter: boolean;
  onVideoEnd: () => void;
  onVideoStart: () => void;
  onCardChange: () => void;
  onTimeUpdate: (remaining: number) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const getTransform = () => {
    if (position === 0) {
      return 'translateX(0) scale(1) rotateY(0deg)';
    }

    const maxVisible = Math.min(3, Math.floor(totalCards / 2));

    if (position <= maxVisible) {
      const offset = position * 80;
      const scale = 1 - position * 0.15;
      const rotateY = position * -8;
      return `translateX(${offset}px) scale(${scale}) rotateY(${rotateY}deg)`;
    } else if (position >= totalCards - maxVisible) {
      const reversePosition = totalCards - position;
      const offset = -reversePosition * 80;
      const scale = 1 - reversePosition * 0.15;
      const rotateY = reversePosition * 8;
      return `translateX(${offset}px) scale(${scale}) rotateY(${rotateY}deg)`;
    }

    return 'translateX(0) scale(0.5) rotateY(0deg)';
  };

  const getZIndex = () => {
    if (position === 0) return 30;
    const maxVisible = Math.min(3, Math.floor(totalCards / 2));
    if (position <= maxVisible) return 30 - position;
    if (position >= totalCards - maxVisible) return 30 - (totalCards - position);
    return 0;
  };

  const getOpacity = () => {
    if (position === 0) return 1;
    const maxVisible = Math.min(3, Math.floor(totalCards / 2));
    if (position <= maxVisible || position >= totalCards - maxVisible) return 1;
    return 0;
  };

  useEffect(() => {
    setIsVisible(isCenter);
  }, [isCenter]);

  const isVideoFile = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) || !url.includes('youtube') && !url.includes('instagram');
  };

  const getYouTubeVideoId = (url: string) => {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    const youtubeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    return shortsMatch?.[1] || watchMatch?.[1] || youtubeMatch?.[1];
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  useEffect(() => {
    if (durationTimerRef.current) {
      clearTimeout(durationTimerRef.current);
      durationTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    onTimeUpdate(0);

    if (isCenter) {
      const displayDuration = review.custom_display_duration || review.video_duration || 30;
      startTimeRef.current = Date.now();

      if (review.custom_display_duration) {
        durationTimerRef.current = setTimeout(() => {
          onVideoEnd();
        }, review.custom_display_duration * 1000);

        countdownIntervalRef.current = setInterval(() => {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remaining = Math.max(0, displayDuration - elapsed);
          onTimeUpdate(remaining);

          if (remaining === 0 && countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
        }, 1000);
      }

      if (isVideoFile(review.video_url)) {
        const video = videoRef.current as HTMLVideoElement;
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
          setIsPlaying(true);
        }
      }

      onVideoStart();
      setShowControls(true);
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        if (durationTimerRef.current) clearTimeout(durationTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      };
    } else {
      if (isVideoFile(review.video_url)) {
        const video = videoRef.current as HTMLVideoElement;
        if (video) {
          video.pause();
          video.currentTime = 0;
          setIsPlaying(false);
        }
      }
    }
  }, [isCenter, review.video_url, review.custom_display_duration, review.video_duration, onVideoStart, onVideoEnd, onTimeUpdate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(false);
  };

  const handleVideoEnded = () => {
    if (!review.custom_display_duration) {
      onVideoEnd();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isCenter) return;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        onCardChange();
      }
    }
  };

  const handleClick = () => {
    if (!isCenter) return;
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <div
      className="absolute transition-all duration-700 ease-out"
      style={{
        transform: getTransform(),
        zIndex: getZIndex(),
        opacity: getOpacity(),
        pointerEvents: position === 0 ? 'auto' : 'none',
      }}
    >
      <Card className="overflow-hidden border-4 border-background shadow-2xl bg-black relative">
        <div
          className="w-[280px] h-[500px] md:w-[320px] md:h-[570px] relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        >
          {isVideoFile(review.video_url) ? (
            <>
              <video
                ref={videoRef as any}
                src={review.video_url}
                className="w-full h-full object-cover"
                muted={isMuted}
                playsInline
                controls={false}
                onEnded={handleVideoEnded}
              />
              {position === 0 && (
                <div
                  className={`absolute bottom-24 left-0 right-0 flex justify-center gap-3 transition-opacity duration-300 z-30 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ pointerEvents: showControls ? 'auto' : 'none' }}
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full w-12 h-12 shadow-xl bg-white/90 hover:bg-white backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full w-12 h-12 shadow-xl bg-white/90 hover:bg-white backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : isYouTubeUrl(review.video_url) ? (
            <div className="w-full h-full relative bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-8 cursor-pointer" onClick={() => setShowYouTubeModal(true)}>
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-red-600 rounded-full opacity-20 animate-pulse"></div>
                  <div className="relative bg-red-600 w-full h-full rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                    <Play className="w-12 h-12 text-white ml-1" fill="white" />
                  </div>
                </div>
                <p className="text-white text-lg font-semibold">Watch on YouTube</p>
                <p className="text-gray-400 text-sm">Click to view</p>
              </div>
            </div>
          ) : null}

          {isYouTubeUrl(review.video_url) && (
            <Dialog open={showYouTubeModal} onOpenChange={setShowYouTubeModal}>
              <DialogContent className="max-w-3xl p-0 bg-black border-none">
                <div className="relative" style={{ paddingBottom: '177.78%', maxHeight: '90vh' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(review.video_url)}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          <div className="absolute top-4 -left-12 h-full flex items-center pointer-events-none">
            <div
              className="text-white font-bold text-2xl tracking-widest"
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              {review.reviewer_name}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pointer-events-none z-20">
            <h3 className="text-white font-bold text-xl mb-1">{review.reviewer_name}</h3>
            <p className="text-white/90 text-sm uppercase tracking-wider">{review.reviewer_role}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VideoReviews;
