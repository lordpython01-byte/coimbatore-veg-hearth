import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catering from "@/components/Catering";
import PartyHalls from "@/components/PartyHalls";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import VideoReviews from "@/components/VideoReviews";
import ReviewForm from "@/components/ReviewForm";
import Locations from "@/components/Locations";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Catering />
      <PartyHalls />
      <Menu />
      <Gallery />
      <Testimonials />
      <VideoReviews />
      <ReviewForm />
      <Locations />
      <Footer />
    </div>
  );
};

export default Index;
