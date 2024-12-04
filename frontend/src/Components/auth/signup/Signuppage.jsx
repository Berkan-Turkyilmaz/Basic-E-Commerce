// Import React dependencies and CSS file
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signuppage.css";
import toast from "react-hot-toast";
import { CiUser } from "react-icons/ci";
import {  MdPassword, MdDriveFileRenameOutline, MdOutlineEmail } from "react-icons/md";
import { PiXLogoThin } from "react-icons/pi";
import { AuthContext } from "../../../GlobalContext";

const Signuppage = () => {
  const { API_URL } = useContext(AuthContext);

	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});
    const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
        setIsError(false);
        setErrorMessage("");

        try {
          console.log(formData)
            const res = await fetch(`${API_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
        credentials: "include",
      });
            const data = await res.json();
            if(!res.ok) {
                throw new Error(data.error || "Something went wrong");
                
            }
			toast.success("Signup Successful");
            console.log("Signup Successful")
            navigate("/login");
        } catch (error) {
          
            setErrorMessage(error.message);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className="signup-container">
        <div className="signup-left-cont">
        <div className="image-x">
            <PiXLogoThin size={500} />
          </div>
        </div>
        <div className="signup-right-cont">
          <div className="dont-miss">Happening Now</div>
          <h1 className="sign-in-to-x">Join today.</h1>
          <div className="input-cont">
          <div className="input-icon-cont">
              <MdOutlineEmail style={{ fill: "gray" }}  />

              <input
                className="signup-input"
                type="text"
                placeholder="E-Mail"
                onChange={handleInputChange}
                value={formData.email}
                name="email"
              />
            </div>
            <div className="input-icon-cont">
            <CiUser color="gray" />


              <input
                className="signup-input"
                type="text"
                placeholder="Username"
                onChange={handleInputChange}
                value={formData.username}
                name="username"

              />
            </div>
            <div className="input-icon-cont">
            <MdDriveFileRenameOutline style={{ fill: "gray" }} color="gray" />


              <input
                className="signup-input"
                type="text"
                placeholder="Name"
                onChange={handleInputChange}
                value={formData.name}
                name="name"
              />
            </div>
            <div className="input-icon-cont">
              <MdPassword  style={{ fill: "gray" }} />

              <input
                className="signup-input"
                type="password"
                placeholder="Password"
                onChange={handleInputChange}
                value={formData.password}
                name="password"
              />
            </div>
          </div>
          <div className="signup-button-cont">
            <button className="signup-button" onClick={handleSubmit}>Sign Up</button>
          </div>
          <div className="already-have-cont">
            <div className="already-have">Already have an account?</div>
          </div>
          <div className="switch-to-cont">
            <Link to="/login">
            <button onClick={() => handleSubmit()} className="switch-button" >Sign In</button>
            </Link>
          </div>
        </div>
        </div>
    );
  };

export default Signuppage;
