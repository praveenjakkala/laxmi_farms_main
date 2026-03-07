import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import AIAssistant from "@/components/ui/AIAssistant";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "Laxmi Farms - Premium Country Chicken | Fresh Farm to Table",
    template: "%s | Laxmi Farms",
  },
  description:
    "Experience authentic country chicken (Natu Kodi) from Laxmi Farms. Naturally raised, hormone-free poultry delivered fresh to your doorstep in Telangana. Weekly & monthly subscriptions available.",
  keywords: [
    "country chicken",
    "natu kodi",
    "farm chicken",
    "desi chicken",
    "organic chicken",
    "Telangana poultry",
    "fresh chicken delivery",
    "Laxmi Farms",
    "kadaknath chicken",
    "giriraja chicken",
    "desi eggs",
    "egg subscription",
    "chicken subscription",
    "farm fresh eggs Nalgonda",
    "weekly egg delivery",
  ],
  authors: [{ name: "Laxmi Farms" }],
  creator: "Laxmi Farms",
  publisher: "Laxmi Farms",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://laxmifarms.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://laxmifarms.in",
    siteName: "Laxmi Farms",
    title: "Laxmi Farms - Premium Country Chicken & Farm Fresh Eggs",
    description:
      "Experience authentic country chicken from our farm. Naturally raised, hormone-free poultry delivered fresh. Subscribe for weekly eggs & monthly chicken.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Laxmi Farms - Premium Country Chicken",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laxmi Farms - Premium Country Chicken",
    description:
      "Farm-fresh country chicken and desi eggs delivered to your door. Natural, hormone-free, traditional farming.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Laxmi Farms",
              "description": "Authentic country chicken and desi eggs from naturally raised poultry in Nalgonda, Telangana.",
              "url": "https://laxmifarms.in",
              "telephone": "+919885167159",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nalgonda",
                "addressRegion": "Telangana",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "17.0575",
                "longitude": "79.2677"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "06:00",
                "closes": "21:00"
              },
              "priceRange": "₹₹",
              "servesCuisine": "Farm Products",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Farm Products",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Country Chicken" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Kadaknath Chicken" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Desi Eggs" } }
                ]
              }
            })
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <AIAssistant />
        <WhatsAppButton />
        <SpeedInsights />
      </body>
    </html>
  );
}
