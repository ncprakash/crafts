import NavSection from "@/components/NavBar";
import PolaroidSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VideoSection from "@/components/VideoSection";
import CustomerTestimonials from "@/components/customerSection";

export default function Home() {
  return (
    <>
      <NavSection/>
      <PolaroidSection/>
      <AboutSection/>
      <VideoSection/>
      <CustomerTestimonials/>
    </>
  );
}
