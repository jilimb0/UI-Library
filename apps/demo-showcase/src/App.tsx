import { ThemeProvider } from '@ui-construction-library/core';
import { CrossSiteNav } from './CrossSiteNav';
import { ArchitectureSection } from './components/ArchitectureSection';
import { ComponentGalleryCard } from './components/ComponentGalleryCard';
import { FlagshipFlowsSection } from './components/FlagshipFlowsSection';
import { FooterSection } from './components/FooterSection';
import { HeaderBar } from './components/HeaderBar';
import { HeroSection } from './components/HeroSection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { LeadFormCard } from './components/LeadFormCard';
import { MotionAndHooksCard } from './components/MotionAndHooksCard';
import { ThemePlaygroundCard } from './components/ThemePlaygroundCard';

const DOCS_URL = './docs/';
const STORYBOOK_URL = './storybook/';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function ShowcasePage() {
  return (
    <div className="showcase-page">
      <HeaderBar scrollTo={scrollTo} />
      <main className="showcase-shell stack-xl">
        <HeroSection />
        <FlagshipFlowsSection />
        <CrossSiteNav
          current="demo"
          docsHref={DOCS_URL}
          storybookHref={STORYBOOK_URL}
        />
        <ArchitectureSection />
        <div className="feature-grid feature-grid--dual">
          <ThemePlaygroundCard />
          <LeadFormCard />
        </div>
        <ComponentGalleryCard />
        <IntegrationsSection />
        <MotionAndHooksCard />
        <FooterSection />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ShowcasePage />
    </ThemeProvider>
  );
}
