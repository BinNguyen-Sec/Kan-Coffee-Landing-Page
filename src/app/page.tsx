import Navigation from '@/components/ui/Navigation'
import Hero from '@/components/sections/Hero'
import InspiredStory from '@/components/sections/InspiredStory'
import FloorPlan from '@/components/sections/FloorPlan'

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <InspiredStory />
      <FloorPlan />
      {/* Sprint 4: Policy */}
    </main>
  )
}