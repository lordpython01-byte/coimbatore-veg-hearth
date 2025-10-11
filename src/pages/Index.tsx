import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catering from "@/components/Catering";
import PartyHalls from "@/components/PartyHalls";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import ReviewForm from "@/components/ReviewForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Catering />
      <PartyHalls />
      <Menu />
      <Gallery />
      <Testimonials />
      <ReviewForm />
      <Footer />
    </div>
  );
};

export default Index;
