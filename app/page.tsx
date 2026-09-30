import Preloader from '@/components/Preloader'
import SmoothScroll from '@/components/SmoothScroll'
import Nav from '@/components/Nav'
import Cursor from '@/components/Cursor'
import Experience from '@/components/sections/Experience'
import Marquee from '@/components/sections/Marquee'
import Manifesto from '@/components/sections/Manifesto'
import Ranges from '@/components/sections/Ranges'
import Workshop from '@/components/sections/Workshop'
import Retul from '@/components/sections/Retul'
import Offers from '@/components/sections/Offers'
import Visit from '@/components/sections/Visit'
import Booking from '@/components/sections/Booking'
import Faq from '@/components/sections/Faq'
import Footer from '@/components/Footer'
import MobileBar from '@/components/MobileBar'

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Nav />
      <main id="top">
        <Experience />
        <Marquee />
        <Manifesto />
        <Ranges />
        <Workshop />
        <Retul />
        <Offers />
        <Visit />
        <Booking />
        <Faq />
      </main>
      <Footer />
      <MobileBar />
      <div className="grain" aria-hidden />
    </>
  )
}
