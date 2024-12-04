import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); 
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 const API_URL = "";
 


  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLoggedIn,setIsLoggedIn, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};
