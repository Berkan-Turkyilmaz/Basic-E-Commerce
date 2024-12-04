// Import React dependencies and CSS file
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Loginpage.css";
import toast from "react-hot-toast";
import { MdPassword } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { AuthContext } from "../../../GlobalContext";
import { PiXLogoThin } from "react-icons/pi";

const Loginpage = () => {
  const { setAuthUser, setIsLoggedIn, isLoggedIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    console.log(formData);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      toast.success("Login Successful");
      setAuthUser(data);
      setIsLoggedIn(true);
      console.log("Login Successful", data);

      navigate("/");
    } catch (error) {
      setErrorMessage(error.message);
      setIsError(true);
      console.log(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="login-container">
        <div className="login-left-cont">
          <div className="image-x ">
            <PiXLogoThin size={500} />
          </div>
        </div>
        <div className="login-right-cont">
          <h1 className="dont-miss-2">Dont miss out on the latest news!</h1>
          <div className="sign-in-with-logo">
            <h1 className="">Sign in to </h1>
            <PiXLogoThin size={50} />
          </div>

          <div className="input-cont">
            <div className="input-icon-cont">
              <MdOutlineEmail color="gray" style={{ fill: "gray" }} />

              <input
                className="login-input"
                type="text"
                placeholder="E-Mail"
                onChange={handleInputChange}
                value={formData.email}
                name="email"
              />
            </div>
            <div className="input-icon-cont">
              <MdPassword style={{ fill: "gray" }} />

              <input
                className="login-input"
                type="password"
                placeholder="Password"
                onChange={handleInputChange}
                value={formData.password}
                name="password"
              />
            </div>
          </div>
          <div className="login-button-cont">
            <button className="login-button" onClick={handleSubmit}>
              Sign In
            </button>
          </div>
          
          <div className="switch-to-cont">
            <Link to="/signup">
              <button className="switch-button">Create Account</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginpage;
