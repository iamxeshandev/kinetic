import { AdvertisementSection } from './components/AdvertisementSection';
import { ClientSection } from './components/ClientSection';
import { FeatureSection } from './components/FeatureSection';
import { HeroSection } from './components/HeroSection';
import { HighlightSection } from './components/HighlightSection';

export function HomeView() {
  return (
    <>
      <HeroSection />
      <ClientSection />
      <HighlightSection />
      <FeatureSection />
      <AdvertisementSection />
    </>
  );
}
