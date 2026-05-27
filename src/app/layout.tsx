import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KT Bank AG — Meine Werte, meine Bank. | Banque Islamique Allemagne",
  description: "KT Bank AG est la première banque islamique d'Allemagne. Comptes courants, épargne or, financement halal, crédit immobilier et pro. 100% Sharia-compliant, régulée BaFin.",
  keywords: "KT Bank, banque islamique, Allemagne, halal, finance islamique, sans intérêts, GiroKonto, GoldKonto",
  openGraph: {
    title: "KT Bank AG — La première banque islamique d'Allemagne",
    description: "Services bancaires 100% conformes à la charia. Comptes, épargne, financement halal.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar/>
        <main className="flex-1 pt-[104px]">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
