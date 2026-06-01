'use client'

import OceanSystem from '@/components/ocean/OceanSystem'
import FishingThread from '@/components/ocean/FishingThread'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Stack from '@/components/sections/Stack'
import Work from '@/components/sections/Work'
import Contact from '@/components/sections/Contact'
import Nav from '@/components/ui/Nav'
import CustomCursor from '@/components/ui/CustomCursor'

export default function HomePage() {
  return (
    <OceanSystem>
      <CustomCursor />
      <Nav />
      <FishingThread />
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Contact />
      </main>
    </OceanSystem>
  )
}
