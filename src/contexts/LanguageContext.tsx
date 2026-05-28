"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Lang, Translations } from "@/lib/translations";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageCtx>({
  lang: "de",
  setLang: () => {},
  t: translations.de,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("kt_lang") as Lang | null;
    if (stored === "de" || stored === "fr") setLangState(stored);
  }, []);

  // Update html lang attribute whenever language changes
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("kt_lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
