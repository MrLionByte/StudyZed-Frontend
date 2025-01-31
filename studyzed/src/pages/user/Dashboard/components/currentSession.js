// Save sessionData
export const saveSessionData = (sessionData) => {
    if (sessionData) {
      localStorage.setItem("currentSession", JSON.stringify(sessionData));
    }
  };
  
// GET sessionData
export const getSessionData = () => {
    const data = localStorage.getItem("currentSession");
    return data ? JSON.parse(data) : null;
  };
  
  // Clear sessionData
export const clearSessionData = () => {
    localStorage.removeItem("currentSession");
  };
  