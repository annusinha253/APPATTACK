
import './App.css';
import React, { useEffect, useState } from 'react';
import MainPage from "./components/MainPage";
import Chatbot from "./components/chatbot";
import ThemeAndLangToggle from "./components/ThemeAndLangToggle";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="App">
      <ThemeAndLangToggle theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
      <MainPage language={language} />
      <Chatbot />
    </div>
  );
}

export default App;
