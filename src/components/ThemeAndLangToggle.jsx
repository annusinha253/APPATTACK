import React, { useEffect, useState } from "react";

const translations = {
  en: {
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    english: "English",
    hindi: "Hindi"
  },
  hi: {
    theme: "थीम",
    light: "हल्का",
    dark: "गहरा",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी"
  }
};

const ThemeAndLangToggle = ({ theme, setTheme, language, setLanguage }) => {
  const t = translations[language] || translations.en;

  // Theme toggle handler
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  // Language change handler
  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="theme-lang-toggle">
      <button className="theme-toggle-btn" onClick={handleThemeToggle}>
        {t.theme}: {theme === "light" ? t.light : t.dark}
      </button>
      <select className="lang-select" value={language} onChange={handleLangChange}>
        <option value="en">{t.english}</option>
        <option value="hi">{t.hindi}</option>
      </select>
      <style>{`
        .theme-lang-toggle {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: flex-end;
          margin-bottom: 10px;
        }
        .theme-toggle-btn {
          background: #b48a5a;
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 8px 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .theme-toggle-btn:hover {
          background: #7c4a03;
        }
        .lang-select {
          border-radius: 20px;
          border: 1.5px solid #b48a5a;
          padding: 7px 14px;
          font-weight: 500;
          color: #7c4a03;
          background: #fffbe9;
        }
      `}</style>
    </div>
  );
};

export default ThemeAndLangToggle;
