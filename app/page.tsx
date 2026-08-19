import { Hero } from "@/src/components/home/Hero";
import { StickyReservationBar } from "@/src/components/home/StickyReservationBar";

export default function Home() {
  return (
    <main>
      <StickyReservationBar />
      <Hero />
    </main>
  );
}
