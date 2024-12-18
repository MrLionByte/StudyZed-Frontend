const LOCAL_STORAGE_KEY = 'authData';

export const savedAuthState = (authState) => {
    localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(authState));
    console.log(localStorage.getItem(LOCAL_STORAGE_KEY));
    console.log(localStorage.getItem('authState'));
    
};

export const getSavedAuthState = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
};

export const clearSavedAuthState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};