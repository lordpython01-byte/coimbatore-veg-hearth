import { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import menu1 from "@/assets/menu_1.jpg";
import menu2 from "@/assets/menu_2.jpg";
import menu3 from "@/assets/menu_3.jpg";
import menu4 from "@/assets/menu_4.jpg";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Menu = () => {
  const bookRef = useRef<any>(null);

  const menuPages = [menu1, menu2, menu3, menu4];

  return (
    <section id="menu" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Our Menu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our authentic Tamil Nadu delicacies - flip through our digital menu
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative shadow-2xl rounded-lg overflow-hidden">
            <HTMLFlipBook
              width={550}
              height={733}
              size="stretch"
              minWidth={300}
              maxWidth={600}
              minHeight={400}
              maxHeight={800}
              showCover={true}
              mobileScrollSupport={true}
              className="flipbook"
              ref={bookRef}
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={true}
              startZIndex={0}
              autoSize={true}
              maxShadowOpacity={0.5}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {menuPages.map((page, index) => (
                <div key={index} className="page">
                  <img
                    src={page}
                    alt={`Menu page ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </HTMLFlipBook>
          </div>

          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => bookRef.current?.pageFlip().flipPrev()}
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className="gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Click on the corners or use the buttons to flip pages
          </p>
        </div>
      </div>
    </section>
  );
};

export default Menu;
