import Navbar from '@/components/Navbar';
import HomeContent from '@/components/HomeContent';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#0B0B0B] overflow-x-hidden">
      <Navbar />
      <HomeContent />
    </main>
  );
}
