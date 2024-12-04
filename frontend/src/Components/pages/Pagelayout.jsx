  // src/Components/pages/Pagelayout.jsx

  import React, { useContext, useEffect, useState } from "react";
  import "./Pagelayout.css";
  import { Link, Outlet, useNavigate } from "react-router-dom";
  import { RiTwitterXLine } from "react-icons/ri";
  import { IoHomeSharp } from "react-icons/io5";
  import { CgProfile, CgLogOut } from "react-icons/cg";
  import { IoMdNotifications } from "react-icons/io";
  import toast from "react-hot-toast";
  import { AuthContext } from "../../GlobalContext";
  import followUnfollow from "../../Components/other/followUnfollow";

  export default function Pagelayout() {
    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const { authUser, setAuthUser, setIsLoggedIn, API_URL } = useContext(AuthContext);
    
    const handleLogout = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setIsError(false);
      setErrorMessage("");

      try {
        const res = await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        toast.success("Logout Successful");
        setAuthUser(null);  
        setIsLoggedIn(false);
        navigate("/login");
      } catch (error) {
        setErrorMessage(error.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSuggestedUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/suggested`, {
          method: "GET", credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        setSuggestedUsers(data);
        console.log("Successfully fetched suggested users", data);
        
      } catch (error) {
        console.log(error.message, "Server side error during suggested user fetching");
      }
    };
    
    useEffect (() => {
      fetchSuggestedUsers();
    }, []);

    const handleFollow = async (id) => {
      const res = await followUnfollow(id);
      if (res.error) {
        toast.error(res.error);
      }
      toast.success("Successfully followed user");
      console.log("successfully followed user", res);
      fetchSuggestedUsers();
    }

    if(isLoading) return <div>Loading...</div>;

    return (
      <div className="page-layout">
        <div className="home-left">
          <div className="sidebar-top">
            <div className="sidebar-logo">
              <Link to="/">
                <RiTwitterXLine size={40} color="black" />
              </Link>
            </div>
            <div className="sidebar-logo">
              <Link to="/">
                <IoHomeSharp size={30} color="black" />
              </Link>
              <span className="logo-exp">Home</span>
            </div>
            <div className="sidebar-logo">
              <Link to="/notifications">
                <IoMdNotifications size={30} color="black" />
              </Link>
              <span className="logo-exp">Notifications</span>
            </div>
            <div className="sidebar-logo">
              <Link to={`/profile/${authUser?.username}`} >
                <CgProfile size={30} color="black" />
              </Link>
              <span className="logo-exp">Profile</span>
            </div>
          </div>

          <div  className="sidebar-logout">
            <div className="sidebar-logout-avatar">
              <Link to={`/profile/${authUser?.username}`}>
              <img
                className="logout-avatar"
                size={40}
                src={authUser?.profileImg } 
                alt="User Avatar"
              />
              </Link>
            </div>
            <div className="sidebar-logout-user-and-username">
              <div className="logout-user">{authUser?.fullName}</div>
              <div className="logout-username">@{authUser?.username}</div>
            </div>
            <div className="logout-icon-cont">
              <CgLogOut className="logout-icon" onClick={handleLogout} size={30} />
            </div>
          </div>
        </div>

        <div className="outlet">
          <Outlet />
        </div>
        <div className="home-right">
            <div className="home-right-left">
              <div className="suggested-users-box">
                <div className="who-to-follow">
                  <span>Who to follow</span>
                </div>
                <div className="who-to-follow-user-container">
                  {suggestedUsers.map((user) => (
                    <div key={user._id} className="who-to-follow-user">
                      
                      <div className="who-to-follow-user-avatar-container">
                      <Link to={`/profile/${user.username}`}>
                        <img
                          className="who-to-follow-user-avatar"
                          src={user.profileImg}
                          alt=""
                        /></Link>
                      </div>
                      <div className="who-to-follow-user-name-and-username">
                        
                        <span className="who-to-follow-user-user">
                          {user.fullName}
                        </span>
                        <span className="who-to-follow-user-username">
                          @{user.username}
                        </span>
                      </div>
                      
                      <div className="who-to-follow-user-follow-button-container">
                        <button onClick={() => handleFollow(user._id)} className="who-to-follow-user-follow-button">
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
      </div>
    );
  }
