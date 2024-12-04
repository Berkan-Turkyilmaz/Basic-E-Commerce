import React, { useContext, useEffect, useState } from "react";
import "./Profilepage.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegCalendarAlt, FaRegComment } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { BiRepost } from "react-icons/bi";
import { CiViewBoard } from "react-icons/ci";
import { BsBookmark } from "react-icons/bs";
import { AuthContext } from "../../GlobalContext";
import toast from "react-hot-toast";
import { FcLike } from "react-icons/fc";
import followUnfollow from "../../Components/other/followUnfollow";


export default function Profilepage() {
  const { authUser, API_URL } = useContext(AuthContext);
  const { username } = useParams();
  const [fetchedProfileInfos, setFetchedProfileInfos] = useState(null);
  const [fetchedUserPosts, setFetchedUserPosts] = useState(null);
  const [fetchedId, setFetchedId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

    const fetchProfile = async (username) => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/profile/${username}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setFetchedProfileInfos(data);
      setFetchedId(data._id);
      if (data.followers.includes(authUser._id)) {
        setIsFollowing(true);
      }
      console.log(data, "fetchedProfileInfos");
    } catch (error) {
      console.log(
        "Server Side error during fetching profile infos",
        error.message
      );
    }
  };

  useEffect(() => {
    fetchProfile(username);
  }, [username, isFollowing]);

  const fetchUserPosts = async (id) => {
    try {
      if (!id) return;
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setFetchedUserPosts(data);
      console.log("fetched user posts", data);
    } catch (error) {
      console.log("server side error during user post fetch");
    }
  };
  useEffect(() => {
    fetchUserPosts(fetchedId);
  }, [fetchedId]);

  const deletePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      fetchUserPosts(fetchedId);
      toast.success("Successfully deleted post");
      console.log("Successfully deleted post", data);
    } catch (error) {
      console.log(error.message, "Server side error during post deletion");
    }
  };

  const likePost = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/posts/likes/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      fetchUserPosts(fetchedId);
      return data;
    } catch (error) {
      console.log(error.message, "Server side error during like ");
      return { error: error.message };
    }
  };
  const handleFollow = async (id) => {
    const res = await followUnfollow(id);
    if (res.error) {
      toast.error(res.error);
    }
    console.log("successfully followed user", res);
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="profile-outer">
      <div className="first-area">
        <div className="first-area-icon">
          <Link to="/">
            <IoMdArrowRoundBack size={20} />
          </Link>
        </div>
        <div className="first-area-text">
          <div className="first-area-text-1">
            {fetchedProfileInfos?.fullName}
          </div>
          <div className="first-area-text-2">
            {fetchedUserPosts?.length} Posts
          </div>
        </div>
      </div>
      <div className="second-area">
        <div className="second-area-bg">
          <img className="second-area-coverImg" src={fetchedProfileInfos?.coverImg} alt="" />
        </div>
        <div className="second-area-infos">
          <img
            className="second-area-avatar"
            src={fetchedProfileInfos?.profileImg}
            alt=""
          />
          {authUser?._id === fetchedProfileInfos?._id ? (
            <button  className="second-area-button">Edit profile</button>
          ) : isFollowing ? (
            <button
              onClick={() => handleFollow(fetchedProfileInfos?._id)}
              className="unfollow-button"
            >
              Following
            </button>
          ) : (
            <button
              onClick={() => handleFollow(fetchedProfileInfos?._id)}
              className="follow-button"
            >
              Follow
            </button>
          )}
          <div className="infos-details">
            <div className="user-username">
              <div className="infos-details-user-details">
                {fetchedProfileInfos?.fullName}
              </div>
              <div className="infos-details-username">
                @{fetchedProfileInfos?.username}
              </div>
            </div>
            <div className="infos-details-bio">{fetchedProfileInfos?.bio}</div>
            <div className="infos-details-joined">
              <div>
                <FaRegCalendarAlt color="gray" /> Joined{" "}
                {fetchedProfileInfos?.joinedAt}
              </div>
              <div className="followers-followings-container">
                <div className="numberoffollowings">
                  <div className="number">
                    {fetchedProfileInfos?.following?.length}
                  </div>
                  <div className="style">Following</div>
                </div>
                <div className="numberoffollowers">
                  <div className="number">
                    {fetchedProfileInfos?.followers?.length}
                  </div>
                  <div className="style">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="third-area">
        {fetchedUserPosts?.map((post) => (
          <div key={post._id} className="third-area-individual">
            <div className="third-area-avatar-cont">
              <img
                className="third-area-avatar"
                src={post.user.profileImg}
                alt=""
              />
            </div>

            <div className="names-trashcan">
              <div className="third-area-name-username">
                <div className="third-area-name">{post.user.fullName}</div>
                <div className="third-area-username">@{post.user.username}</div>
              </div>

              {post.user._id === authUser._id && (
                <div className="third-area-trashcan">
                  <AiOutlineDelete
                    className="delete-icon-third"
                    onClick={() => deletePost(post._id)}
                    size={25}
                  />
                </div>
              )}
            </div>
            <div className="third-area-text-image-cont">
              <div className="third-area-post-text">{post.text}</div>
              <div className="third-area-post-image">
                <img className="third-area-image-indiv" src={post.img} alt="" />
              </div>
            </div>
            <div className="icon-cont">
              <div className="third-area-icons">
                <div className="icon-number">
                  <FaRegComment size={20} />
                  <span>0</span>
                </div>
                <div className="icon-number">
                  <BiRepost size={20} />
                  <span>0</span>
                </div>
                <div onClick={() => likePost(post._id)} className="icon-number">
                  {post.likes.includes(authUser._id) ? (
                    <FcLike size={20} />
                  ) : (
                    <IoIosHeartEmpty size={20} />
                  )}

                  <span>{post.likes.length}</span>
                </div>
                <div className="icon-number">
                  <CiViewBoard size={20} />
                  <span>0</span>
                </div>
                <div className="icon-number">
                  <BsBookmark size={20} />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
