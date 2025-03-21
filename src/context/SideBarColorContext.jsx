import { createContext, useContext, useState, useEffect } from "react";

const SideBarContext = createContext();

export function SideBarColorProvider({ children }) {
    const [sideBarColor, setSideBarColor] = useState(localStorage.getItem('sidebarcolor') || '#051F1E');

    useEffect(() => {
        localStorage.setItem("sidebarcolor", sideBarColor);
    }, [sideBarColor]);

    return (
        <SideBarContext.Provider value={{ sideBarColor, setSideBarColor }}>
            <div>
                {children}
            </div>
        </SideBarContext.Provider>
    );
}

export function useSideBarColor() {
    return useContext(SideBarContext);
}
