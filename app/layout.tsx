import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = "https://rentayatesmazatlan.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Renta de Yates en Mazatlán | Precios y Reservas",
    template: "%s | Renta de Yates Mazatlán",
  },
  description: "Renta de yates en Mazatlán con opciones para grupos, paseos, cumpleaños y eventos. Consulta precios, capacidades, amenidades y disponibilidad por WhatsApp.",
  keywords: [
    "renta de yates Mazatlán",
    "yates en Mazatlán",
    "renta yates Mazatlán precios",
    "paseo en yate Mazatlán",
    "catamarán Mazatlán",
    "jet ski Mazatlán",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Renta de Yates Mazatlán",
    title: "Renta de Yates en Mazatlán | Precios y Reservas",
    description: "Yates privados en Mazatlán para paseos, celebraciones y eventos. Compara opciones y solicita disponibilidad por WhatsApp.",
    images: [{ url: "/yate-experiencia-real.webp", width: 1200, height: 630, alt: "Renta de yates en Mazatlán" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renta de Yates en Mazatlán",
    description: "Consulta yates, precios, capacidades y disponibilidad en Mazatlán.",
    images: ["/yate-experiencia-real.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/rym-logo-64.png",
    shortcut: "/rym-logo-64.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#business`,
  name: "Renta de Yates Mazatlán",
  url: siteUrl,
  telephone: "+526692284959",
  image: `${siteUrl}/rym-logo.webp`,
  logo: `${siteUrl}/rym-logo.webp`,
  description: "Renta de yates y experiencias privadas en Mazatlán, Sinaloa.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mazatlán",
    addressRegion: "Sinaloa",
    addressCountry: "MX",
  },
  areaServed: {
    "@type": "City",
    name: "Mazatlán",
  },
  sameAs: [
    "https://www.instagram.com/renta_de_yates_mazatlan/",
    "https://www.tiktok.com/@rentadeyatesmazatlan_",
    "https://www.facebook.com/profile.php?id=61551912925671",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body className={`${manrope.variable} ${playfair.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
