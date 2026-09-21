import { AdvertisementSection } from './AdvertisementSection';
import { ClientSection } from './ClientSection';
import { FeatureSection } from './FeatureSection';
import { HeroSection } from './HeroSection';
import { HighlightSection } from './HighlightSection';

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
