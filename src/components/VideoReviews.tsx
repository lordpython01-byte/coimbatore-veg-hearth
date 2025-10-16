import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const VideoReviews = () => {
  const videoReviews = [
    {
      id: 1,
      name: "Lakshmi Priya",
      role: "Food Blogger",
      videoUrl: "/hero-video.mp4",
      thumbnail: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Regular Customer",
      videoUrl: "/hero-video.mp4",
      thumbnail: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Meena Sundaram",
      role: "Wedding Host",
      videoUrl: "/hero-video.mp4",
      thumbnail: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Venkatesh Iyer",
      role: "Corporate Client",
      videoUrl: "/hero-video.mp4",
      thumbnail: "/placeholder.svg",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">
              Video Reviews
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Hear From Our Guests
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch what our customers have to say about their experience
          </p>
        </div>

        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {videoReviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                <VideoCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

const VideoCard = ({ review }: { review: any }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Auto-play was prevented
            });
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

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

  return (
    <Card className="overflow-hidden border-2 border-border hover:border-accent transition-all duration-300 group">
      <div className="relative aspect-[9/16] bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          poster={review.thumbnail}
        >
          <source src={review.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Play/Pause Overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div
            className={`w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transition-opacity duration-300 ${
              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            {!isPlaying ? (
              <div className="w-0 h-0 border-l-[20px] border-l-primary border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1" />
            ) : (
              <div className="flex gap-1">
                <div className="w-1.5 h-6 bg-primary" />
                <div className="w-1.5 h-6 bg-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{review.name}</h3>
          <p className="text-white/80 text-sm">{review.role}</p>
        </div>
      </div>
    </Card>
  );
};

export default VideoReviews;
