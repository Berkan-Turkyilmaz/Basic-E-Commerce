import { createContext, useEffect, useState } from "react";

// AuthContext oluşturma
export const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); // authUser durumu
 const [isLoggedIn, setIsLoggedIn] = useState(false);
 


  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLoggedIn,setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
