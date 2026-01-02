import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CartDrawer from "@/components/ui/CartDrawer";
import AIAssistant from "@/components/ui/AIAssistant";

export const metadata: Metadata = {
  title: {
    default: "Laxmi Farms - Premium Country Chicken | Fresh Farm to Table",
    template: "%s | Laxmi Farms",
  },
  description:
    "Experience authentic country chicken (Natu Kodi) from Laxmi Farms. Naturally raised, hormone-free poultry delivered fresh to your doorstep in Telangana.",
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
    title: "Laxmi Farms - Premium Country Chicken",
    description:
      "Experience authentic country chicken from our farm. Naturally raised, hormone-free poultry delivered fresh.",
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
      "Experience authentic country chicken from our farm. Naturally raised, hormone-free poultry delivered fresh.",
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
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <AIAssistant />
      </body>
    </html>
  );
}
