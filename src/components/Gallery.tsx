import { useEffect, useRef, useState } from "react";
import coffeeImage from "@/assets/coffee.jpg";
import pongalImage from "@/assets/dish-pongal.jpg";
import vadaImage from "@/assets/dish-vada.jpg";
import idliImage from "@/assets/dish-idli.jpg";
import dosaImage from "@/assets/dosa.jpg";

const Gallery = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const images = [
    { src: dosaImage, alt: "Restaurant interior", span: "md:col-span-2 md:row-span-2" },
    { src: dosaImage, alt: "Masala Dosa", span: "md:col-span-1 md:row-span-1" },
    { src: idliImage, alt: "Soft Idli", span: "md:col-span-1 md:row-span-1" },
    { src: vadaImage, alt: "Crispy Vada", span: "md:col-span-1 md:row-span-2" },
    { src: pongalImage, alt: "Ven Pongal", span: "md:col-span-1 md:row-span-1" },
    { src: coffeeImage, alt: "Filter Coffee", span: "md:col-span-1 md:row-span-1" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => [...new Set([...prev, index])]);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "50px",
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-accent font-semibold text-sm tracking-wider uppercase">Visual Experience</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Gallery
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A glimpse into our culinary excellence and elegant ambiance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className={`
                ${image.span}
                group relative overflow-hidden rounded-2xl shadow-lg
                transform transition-all duration-700 ease-out
                ${
                  visibleItems.includes(index)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-10 scale-95"
                }
              `}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
                <p className="font-semibold text-lg">{image.alt}</p>
              </div>
              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
