import React, { useContext, useEffect, useState } from "react";
import "./Homepage.css";
import { AiOutlinePicture } from "react-icons/ai";
import { MdGifBox } from "react-icons/md";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { CiViewBoard } from "react-icons/ci";
import { FaRegComment } from "react-icons/fa";
import { BsBookmark } from "react-icons/bs";
import { BiRepost } from "react-icons/bi";
import { IoIosHeartEmpty } from "react-icons/io";
import { AuthContext } from "../../GlobalContext";
import { FcLike } from "react-icons/fc";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Homepage() {
  const { authUser, isLoggedIn, API_URL } = useContext(AuthContext);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [forYouOrFollowing, setForYouOrFollowing] = useState("forYou");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleForYou = () => {
    setForYouOrFollowing("forYou");
  };
  const handleFollowings = () => {
    setForYouOrFollowing("followings");
  };

  const Posts = async (feedType) => {
    const getPostsEndPoint = () => {
      switch (feedType) {
        case "forYou":
          return "/api/posts";
        case "followings":
          return "/api/posts/following";
        default:
          return null;
      }
    };

    const POST_ENDPOINT = getPostsEndPoint();
    if (!POST_ENDPOINT) return;

    try {
      const response = await fetch(`${API_URL}POST_ENDPOINT`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log("Successfully fetched posts",data);
      setFetchedPosts(data);
    } catch (error) {
      console.log(error.message, "Server side error during post fetching");
    }
  };


  useEffect(() => {
    Posts(forYouOrFollowing)
    console.log(authUser, "authUser");
    console.log(isLoggedIn, "isLoggedIn");
    
  }, [forYouOrFollowing]);

  const createPost = async () => {
    try {
      const responseCreate = await fetch(
        `${API_URL}/api/posts/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            image,
          }),
        }
      );
      const dataCreate = await responseCreate.json();
      if (!responseCreate.ok) {
        throw new Error(dataCreate.error || "Something went wrong");
      }
      toast.success("Successfully created post");
      setText("");
      Posts(forYouOrFollowing);
      console.log("Successfully created post", dataCreate);
    } catch (error) {
      console.log(error.message, "Server side error during post creation");
    }
  };

const  deletePost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      toast.success("Successfully deleted post");
      Posts(forYouOrFollowing);
      console.log("Successfully deleted post", data);
    } catch (error) {
      console.log(error.message, "Server side error during post deletion");
    }
  };

  const likePost = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/api/posts/likes/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      Posts(forYouOrFollowing);
      return data;
  
    } catch (error) {
      console.log(error.message, "Server side error during follow/unfollow");
      return { error: error.message };
    }}

  return (
    <div className="homepage-outer">
      <div className="foryou-followings">
        <div className="for-you-and-blue">
          <div
            onClick={handleForYou}
            style={{
              fontWeight: forYouOrFollowing === "forYou" ? "bold" : "normal",
            }}
            className="foryou"
          >
            For You
          </div>
          <div className="blue-cont">
            {forYouOrFollowing === "forYou" && <div className="blue"></div>}
          </div>
        </div>
        <div className="followings-and-blue">
          <div
            onClick={handleFollowings}
            style={{
              fontWeight:
                forYouOrFollowing === "followings" ? "bold" : "normal",
            }}
            className="followings"
          >
            Following
          </div>
          <div className="blue-cont">
            {forYouOrFollowing === "followings" && (
              <div className="blue-2"></div>
            )}
          </div>
        </div>
      </div>
      <div className="second">
        <div className="second-inner">
          <div className="second-avatar-container">
            <img className="second-avatar" src={authUser?.profileImg} alt="" />
          </div>

          <div className="second-input-container">
            <input
              className="second-input"
              type="text"
              placeholder="What is happening?!"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
        <div className="second-icons-container-1">
          <div className="second-icons-container-2">
            <div className="second-icons-container-3">
              <AiOutlinePicture color="blue" size={20} />
              <MdGifBox size={20} />
              <BsEmojiSmileFill size={20} />
              <IoLocationOutline size={20} />
            </div>
            <div>
              <button onClick={() => createPost()} className="second-button">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="third">
        {fetchedPosts.map((post) => (
          <div className="third-post-individual" key={post._id}>
            <div className="third-avatar-container">
              <Link to={`/profile/${post.user.username}`}>
              <img
                className="third-avatar"
                
                src={post.user.profileImg}
                alt=""
              />
              </Link>
            </div>
            
            <div className="post-rest-cont">
              <div className="avatar-and-trashcan">
                <div className="third-user">
                  <div>{post.user.fullName}</div>
                  <div className="poster-username">@{post.user.username}</div>
                </div>
                {post?.user?._id === authUser?._id && (
                  
                  <div
                    onClick={() => deletePost(post._id)}
                    className="delete-icon"
                  >
                    <AiOutlineDelete size={25} />
                  </div>
                )}
              </div>
              <div className="third-post">
                <div className="third-post-text">{post.text}</div>
              </div>
              <div className="third-post-img">
                <img
                  className="post-img"
                  src={post.img || ""}
                  alt=""
                />
              </div>
              <div className="third-post-icons">
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
                    <IoIosHeartEmpty  size={20} />
                  )
                  }
                  
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
