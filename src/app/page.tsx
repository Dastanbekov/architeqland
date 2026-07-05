import TopNavBar from '@/components/TopNavBar';
import HeroInteractive from '@/components/HeroInteractive';
import LogoMarquee from '@/components/LogoMarquee';
import VideoDemo from '@/components/VideoDemo';
import WaitlistSection from '@/components/WaitlistSection';
import FaqSection from '@/components/FaqSection';
import DarkCta from '@/components/DarkCta';

export default function Home() {
  return (
    <>
      <TopNavBar />
      <main className="flex-grow">
        <HeroInteractive />
        <LogoMarquee />
        <VideoDemo />
        <WaitlistSection />
        <FaqSection />
      </main>
      <DarkCta />
    </>
  );
}
