import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "KT Bank AG — Meine Werte, meine Bank.",
  description: "Die erste islamische Bank in der Eurozone. Girokonten, Festgeld, halal Finanzierungen. BaFin-reguliert, Sharia-zertifiziert.",
  keywords: "KT Bank, islamische Bank, Deutschland, halal, Scharia, Islamic Finance, zinsfrei",
  openGraph: {
    title: "KT Bank AG — Meine Werte, meine Bank.",
    description: "Die erste islamische Bank in der Eurozone.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
