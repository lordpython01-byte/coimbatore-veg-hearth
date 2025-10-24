import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface VideoReview {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  video_url: string;
  thumbnail_url?: string;
  display_order: number;
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

  useEffect(() => {
    if (videoReviews.length === 0) return;

    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % videoReviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [videoReviews.length]);

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
                />
              );
            })}
          </div>
        </div>

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
  isCenter
}: {
  review: VideoReview;
  position: number;
  totalCards: number;
  isCenter: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    if (!isVideoFile(review.video_url)) return;

    const video = videoRef.current as HTMLVideoElement;
    if (!video) return;

    if (isCenter) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isCenter, review.video_url]);

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
        <div className="w-[280px] h-[500px] md:w-[320px] md:h-[570px] relative">
          <video
            ref={videoRef as any}
            src={review.video_url}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
            controls={false}
          />

          <div className="absolute top-4 -left-12 h-full flex items-center">
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

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
            <h3 className="text-white font-bold text-xl mb-1">{review.reviewer_name}</h3>
            <p className="text-white/90 text-sm uppercase tracking-wider">{review.reviewer_role}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VideoReviews;
