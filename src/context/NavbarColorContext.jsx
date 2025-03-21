import { createContext, useContext, useState, useEffect } from "react";

const NavBarContext = createContext();

export function NavBarColorProvider({ children }) {
    const [navBarColor, setNavBarColor] = useState(localStorage.getItem('navbarcolor') || '#051F1E');

    useEffect(() => {
        localStorage.setItem("navbarcolor", navBarColor);
    }, [navBarColor]);

    return (
        <NavBarContext.Provider value={{ navBarColor, setNavBarColor }}>
            <div>
                {children}
            </div>
        </NavBarContext.Provider>
    );
}

export function useNavBarColor() {
    return useContext(NavBarContext);
}
