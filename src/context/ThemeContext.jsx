import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        localStorage.setItem("theme", theme);
      }, [theme]);
    
      return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <div className={theme === "dark" ? "dark" : "light"}>
            {children}
          </div>
        </ThemeContext.Provider>
      );
    }
    
export function useTheme() {
      return useContext(ThemeContext);
    }