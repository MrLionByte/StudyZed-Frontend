import { createContext, useContext, useState } from "react";

const FontContext = createContext();

export function FontProvider({ children }) {
  const [fontSettings, setFontSettings] = useState({ fontStyle: "classic" });
  
  const fontClasses = {
    default: "font-sans",
    simple: "font-montserrat",
    modern: "font-mono",
    classic: "font-serif",
    clean: "font-roboto",
    playful:  "font-playful"
  };
  
  const fontUpdateSettings = (newSettings) => {
    setFontSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  return (
    <FontContext.Provider value={{ fontSettings, fontUpdateSettings, fontClasses }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}