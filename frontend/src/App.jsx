import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Pagelayout from "./Components/pages/Pagelayout";
import Homepage from "./Components/pages/Homepage";
import Profilepage from "./Components/pages/Profilepage";
import LoginPage from "./Components/auth/login/LoginPage";
import SignUpPage from "./Components/auth/signup/SignUpPage";
import { Toaster } from "react-hot-toast";

import Notificationspage from "./Components/pages/Notificationspage";
import { useContext, useEffect} from "react";
import { AuthContext } from "./GlobalContext";

function App() {
  const { authUser, setAuthUser  } = useContext(AuthContext);
  
  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <Pagelayout /> : <Navigate to="/login"/> }>
          <Route index element={<Homepage /> }/>
          <Route path="/profile/:username" element={<Profilepage />}/>
          <Route path="/notifications" element={<Notificationspage />}/>
          
        </Route>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
