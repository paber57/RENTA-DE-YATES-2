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

export const metadata: Metadata = {
  title: "Renta de Yates Mazatlán",
  description: "Yates privados en Mazatlán para paseos, cumpleaños y eventos. Cotiza disponibilidad por WhatsApp.",
  other: {
    "codex-preview": "development",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${manrope.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
