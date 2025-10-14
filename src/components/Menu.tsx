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

        <div className="flex items-center justify-center gap-4 md:gap-8 relative">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => bookRef.current?.pageFlip().flipPrev()}
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Book Container */}
          <div className="relative bg-white shadow-2xl rounded-lg p-4 md:p-8 w-full max-w-[95vw] md:max-w-[1100px]">
            <HTMLFlipBook
              width={500}
              height={650}
              size="stretch"
              minWidth={250}
              maxWidth={550}
              minHeight={350}
              maxHeight={700}
              showCover={false}
              mobileScrollSupport={true}
              className="flipbook mx-auto"
              ref={bookRef}
              style={{}}
              startPage={0}
              drawShadow={true}
              flippingTime={800}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={0.3}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
            >
              {menuPages.map((page, index) => (
                <div key={index} className="page bg-white border-r border-gray-200 last:border-r-0">
                  <div className="w-full h-full p-3 md:p-6 flex items-center justify-center">
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

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => bookRef.current?.pageFlip().flipNext()}
            className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-background hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex gap-4 mt-8 justify-center md:hidden">
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

        <p className="text-sm text-muted-foreground mt-6 text-center px-4">
          Click on the page edges to flip or use the arrow buttons
        </p>
      </div>
    </section>
  );
};

export default Menu;
