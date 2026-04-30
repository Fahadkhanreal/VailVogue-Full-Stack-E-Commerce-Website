import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "VeilVogue - Premium Modest Fashion for Women | Abayas, Hijabs & More",
    template: "%s | VeilVogue"
  },
  description: "Shop premium modest fashion clothing for Pakistani women. Discover elegant Abayas, stylish Hijabs, beautiful Kurtis, modest Dresses, and fashionable Accessories. Free shipping on orders over Rs. 3000.",
  keywords: ["modest fashion", "abayas", "hijabs", "kurtis", "modest dresses", "islamic clothing", "pakistani fashion", "women clothing", "modest wear", "VeilVogue"],
  authors: [{ name: "VeilVogue" }],
  creator: "VeilVogue",
  publisher: "VeilVogue",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "VeilVogue",
    title: "VeilVogue - Premium Modest Fashion for Women",
    description: "Shop premium modest fashion clothing for Pakistani women. Discover elegant Abayas, stylish Hijabs, beautiful Kurtis, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VeilVogue - Modest Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VeilVogue - Premium Modest Fashion for Women",
    description: "Shop premium modest fashion clothing for Pakistani women. Discover elegant Abayas, stylish Hijabs, beautiful Kurtis, and more.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
    >
      <body className="min-h-screen">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
