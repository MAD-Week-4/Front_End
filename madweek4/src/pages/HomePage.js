
import HeroSection from "../components/HeroSection";
import ChartSection from "../components/ChartSection";
import Footer from "../components/Footer";
import NewsSection from "../components/NewsSection";


const HomePage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSection />
      <ChartSection />
      <NewsSection />
      <div className="mb-8"></div>
      <Footer />
    </div>
  );
};

export default HomePage;
