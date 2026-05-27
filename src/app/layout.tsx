import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KT Bank AG — Meine Werte, meine Bank.",
  description: "La première banque islamique agréée en Allemagne. Comptes, épargne, financements halal. Régulée BaFin, certifiée Sharia.",
  keywords: "KT Bank, banque islamique, Allemagne, halal, sharia, finance islamique, sans intérêts",
  openGraph: {
    title: "KT Bank AG — Meine Werte, meine Bank.",
    description: "La première banque islamique agréée en Allemagne.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
