import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/archivo/wdth-italic.css'
import '@fontsource-variable/inter/index.css'
import './globals.css'
import { HOURS, SITE } from '@/lib/site'
import { FAQ } from '@/components/sections/Faq'

const base = process.env.NEXT_PUBLIC_SITE_URL || SITE.url

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: 'Normandie Cycles — Magasin de vélos Specialized à Caen · Fleury-sur-Orne',
  description:
    'Magasin Specialized près de Caen : vélos route, gravel, VTT et électriques, S-Works Tarmac SL9, atelier de réparation toutes marques, étude posturale Retül, vélos d’occasion et location. 2 bis route d’Harcourt, Fleury-sur-Orne.',
  keywords: [
    'magasin vélo Caen', 'Specialized Caen', 'vélo électrique Caen', 'réparation vélo Caen', 'VTT Caen', 'vélo de route Caen',
    'gravel Caen', 'étude posturale Caen', 'Retül Caen', 'vélo occasion Caen', 'Fleury-sur-Orne', 'S-Works Tarmac SL9',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Normandie Cycles',
    title: 'Normandie Cycles — Specialized Store Caen',
    description: 'Vélos Specialized, atelier toutes marques et étude posturale Retül à Fleury-sur-Orne, aux portes de Caen.',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'S-Works Tarmac SL9 — Normandie Cycles' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#09090a',
  width: 'device-width',
  initialScale: 1,
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BicycleStore',
    '@id': `${base}/#store`,
    name: 'Normandie Cycles — Specialized',
    url: base,
    image: `${base}/og.jpg`,
    telephone: '+33973588211',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.street,
      postalCode: SITE.zip,
      addressLocality: SITE.city,
      addressRegion: 'Normandie',
      addressCountry: 'FR',
    },
    areaServed: ['Caen', 'Fleury-sur-Orne', 'Ifs', 'Mondeville', 'Calvados'],
    brand: { '@type': 'Brand', name: 'Specialized' },
    openingHoursSpecification: HOURS.flatMap((h) =>
      h.slots.map(([a, b]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: days[h.day], opens: hhmm(a), closes: hhmm(b) })),
    ),
    makesOffer: ['Vente de vélos', 'Réparation de vélos toutes marques', 'Étude posturale Retül', 'Location de vélos', 'Vélos d’occasion'].map((n) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: n },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  )
}
