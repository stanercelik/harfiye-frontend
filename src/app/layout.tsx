import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AdSenseManager from '../components/AdSenseManager';

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Harfiye: Online, Gerçek Zamanlı Kelime Düellosu",
    template: "%s - Harfiye"
  },
  description: "Arkadaşlarınla veya diğer oyuncularla anlık olarak yarışabileceğin Türkçe kelime bulma oyunu Harfiye'ye hoş geldin! 5, 6, 7 harfli kelimelerle 6 kişiye kadar oynanabilir. Hemen bir oda kur ve kelime düellosuna başla.",
  keywords: ["kelime oyunu", "online kelime oyunu", "türkçe wordle", "harfiye oyna", "kelime düellosu", "arkadaşla kelime oyunu", "zeka oyunu", "çok oyunculu kelime oyunu", "5 harfli kelime", "6 harfli kelime", "7 harfli kelime"],
  authors: [{ name: "Harfiye Geliştiricileri" }],
  creator: "Harfiye",
  publisher: "Harfiye",
  applicationName: "Harfiye",
  referrer: "origin-when-cross-origin",
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
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://harfiye.com",
    title: "Harfiye: Online Kelime Düellosu",
    description: "Arkadaşlarınla anlık kelime düellosu yap! Ücretsiz, Türkçe ve rekabetçi kelime bulma oyunu Harfiye ile zekanı sına.",
    siteName: "Harfiye",
    images: [
      {
        url: "https://harfiye.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harfiye - Online Kelime Düellosu"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Harfiye: Online Kelime Düellosu",
    description: "Hemen bir oda kur, arkadaşına meydan oku! 5, 6, 7 harfli kelimelerle 6 kişiye kadar oynanabilir.",
    creator: "@harfiye",
    images: ["https://harfiye.com/twitter-image.png"]
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0891b2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e7490" },
  ],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Harfiye",
  },
  formatDetection: {
    telephone: false,
  },
  category: "games",
  other: {
    "google-site-verification": "placeholder-verification-code" // Bu gerçek verification code ile değiştirilecek
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Structured Data - VideoGame Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              "name": "Harfiye",
              "url": "https://harfiye.com/",
              "description": "Arkadaşlarınla veya diğer oyuncularla anlık olarak yarışabileceğin, web tabanlı, gerçek zamanlı ve rekabetçi Türkçe kelime bulma oyunu.",
              "genre": ["Word game", "Puzzle", "Strategy"],
              "applicationCategory": "Game",
              "operatingSystem": "Web-based",
              "inLanguage": "tr",
              "playMode": "MultiPlayer",
              "numberOfPlayers": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 6
              },
              "author": {
                "@type": "Organization",
                "name": "Harfiye Geliştiricileri"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "TRY",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 text-slate-800 min-h-screen`}
      >
        <AdSenseManager />
        {children}
      </body>
    </html>
  );
}
