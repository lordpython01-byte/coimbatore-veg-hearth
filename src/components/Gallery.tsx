import coffeeImage from "@/assets/coffee.jpg";
import pongalImage from "@/assets/pongal.jpg";
import vadaImage from "@/assets/vada.jpg";
import idliImage from "@/assets/idli.jpg";
import dosaImage from "@/assets/dosa.jpg";
import heroImage from "@/assets/hero-bg.jpg";

const Gallery = () => {
  const images = [
    { src: heroImage, alt: "Restaurant interior" },
    { src: dosaImage, alt: "Masala Dosa" },
    { src: idliImage, alt: "Soft Idli" },
    { src: vadaImage, alt: "Crispy Vada" },
    { src: pongalImage, alt: "Ven Pongal" },
    { src: coffeeImage, alt: "Filter Coffee" },
  ];

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into our culinary excellence and elegant ambiance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow border-2 border-border aspect-square"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
