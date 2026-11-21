"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "EN" | "VI";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "EN",
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("EN");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "EN" || saved === "VI") {
      setLangState(saved);
      document.documentElement.lang = saved.toLowerCase();
    }
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem("lang", next);
    document.documentElement.lang = next.toLowerCase();
  };

  const toggleLang = () => {
    setLang(lang === "EN" ? "VI" : "EN");
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
