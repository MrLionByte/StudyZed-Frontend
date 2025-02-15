import api from "../../../../api/axios_api_call";

export const saveSessionData = (sessionData) => {
    if (sessionData) {
      localStorage.setItem("currentSession", JSON.stringify(sessionData));
    }
  };
  

export const getSessionData =  () => {
    try{
      const data = localStorage.getItem("currentSession");
      return data ? JSON.parse(data) : null;  
    } catch (error){
      console.log(error);
      
    }
   };
  
export const clearSessionData = () => {
    localStorage.removeItem("currentSession");
  };
  