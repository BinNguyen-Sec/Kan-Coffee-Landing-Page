import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import InspiredStory from '@/components/sections/InspiredStory'
import Policy from '@/components/sections/Policy'

const Navigation = dynamic(() => import('@/components/ui/Navigation'), {
  ssr: false,
})

const FloorPlan = dynamic(() => import('@/components/sections/FloorPlan'), {
  ssr: false,
  loading: () => (
    <section id="floorplan" className="py-24 md:py-32 bg-white px-6">
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-kan-primary border-t-transparent animate-spin" />
          <p className="text-sm text-kan-dark/50">Loading floor plan...</p>
        </div>
      </div>
    </section>
  ),
})

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <InspiredStory />
      <FloorPlan />
      <Policy />
    </main>
  )
}