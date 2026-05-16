import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ArtistOfTheMonth from "@/components/ArtistOfTheMonth";
import Catalogue from "@/components/Catalogue";
import ReadingRoomPreview from "@/components/ReadingRoomPreview";
import SubmitStory from "@/components/SubmitStory";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <ArtistOfTheMonth />
      <Catalogue />
      <ReadingRoomPreview />
      <SubmitStory />
      <Footer />
    </main>
  );
}
