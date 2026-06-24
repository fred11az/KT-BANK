"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Lang, Translations } from "@/lib/translations";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  setLangFromProfile: (l: string) => void;
  t: Translations;
}

const SUPPORTED: Lang[] = ["de", "fr", "en", "ar", "tr", "es", "it", "pt", "nl"];

const LanguageContext = createContext<LanguageCtx>({
  lang: "de",
  setLang: () => {},
  setLangFromProfile: () => {},
  t: translations.de,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = localStorage.getItem("kt_lang");
    if (stored && SUPPORTED.includes(stored as Lang)) {
      setLangState(stored as Lang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    // RTL support for Arabic
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("kt_lang", l);
  }

  function setLangFromProfile(l: string) {
    if (SUPPORTED.includes(l as Lang)) {
      setLangState(l as Lang);
      localStorage.setItem("kt_lang", l);
    }
  }

  const t = translations[lang] ?? translations.de;

  return (
    <LanguageContext.Provider value={{ lang, setLang, setLangFromProfile, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
