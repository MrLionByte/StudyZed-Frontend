const LOCAL_STORAGE_KEY = 'authData';

export const savedAuthData = (authData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(authData));
    console.log(localStorage.getItem(LOCAL_STORAGE_KEY));
    console.log(localStorage.getItem('authData'));
    
};

export const getSavedAuthData = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
};

export const clearSavedAuthData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};
