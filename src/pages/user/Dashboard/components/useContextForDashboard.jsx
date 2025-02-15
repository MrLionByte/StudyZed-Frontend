import { createContext, useContext } from "react";

const SessionContext = createContext(null);

export const SessionProvider = ({ children, sessionData }) => (
  <SessionContext.Provider value={sessionData}>{children}</SessionContext.Provider>
);

export const useSession = () => useContext(SessionContext);
