'use client';

import Hero     from '@/components/sections/Hero';
import About    from '@/components/sections/About';
import Work     from '@/components/sections/Work';
import Services from '@/components/sections/Services';
import Contact  from '@/components/sections/Contact';
import Nav      from '@/components/ui/Nav';
import CustomCursor  from '@/components/ui/CustomCursor';
import SmoothScroll  from '@/components/ui/SmoothScroll';

export default function HomePage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Services />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
