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
          <div className="relative shadow-2xl rounded-lg overflow-hidden w-full max-w-[95vw] md:max-w-[1000px]">
            <HTMLFlipBook
              width={450}
              height={600}
              size="stretch"
              minWidth={200}
              maxWidth={500}
              minHeight={300}
              maxHeight={700}
              showCover={true}
              mobileScrollSupport={true}
              className="flipbook mx-auto"
              ref={bookRef}
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={1000}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.5}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {menuPages.map((page, index) => (
                <div key={index} className="page bg-white">
                  <div className="w-full h-full p-2 md:p-4">
                    <img
                      src={page}
                      alt={`Menu page ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
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
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => bookRef.current?.pageFlip().flipNext()}
              className="gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center px-4">
            Click on the corners or use the buttons to flip pages
          </p>
        </div>
      </div>
    </section>
  );
};

export default Menu;
