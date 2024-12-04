import React, { useEffect, useState } from "react";
import "./Notificationspage.css";
import { RiUserFollowFill } from "react-icons/ri";
import { FcLike } from "react-icons/fc";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";

export default function Notificationspage() {
  const { API_URL } = useContext(AuthContext);

  const [fetchedNotifications, setFetchedNotifications] = useState([]);

  const getNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setFetchedNotifications(data.notifications);
      console.log(data, "Notifications");
    } catch (error) {
      console.log(
        error.message,
        "Server side error during notification fetching"
      );
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const deleteNotification = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setFetchedNotifications([]);
      toast.success("Notifications deleted");
      console.log(data, "Notification deleted");
    } catch (error) {
      console.log(
        error.message,
        "Server side error during notification deletion"
      );
    }
  };

  return (
    <div>
      <div className="not-header-clean">
        <div className="not-header">Notifications</div>
        <div className="not-clean">
          <div className="not-cleanbutton">
            <AiOutlineDelete
              size={25}
              onClick={() => deleteNotification()}
            />
          </div>
          <div>Clear all</div>
        </div>
      </div>
      {fetchedNotifications.map((not) => (
        <div className="not-container" key={not._id}>
          <div className="type-and-avatar">
            <div className="not-type">
              {not.type === "follow" ? (
                <RiUserFollowFill size={40} />
              ) : (
                <FcLike size={40} />
              )}
            </div>
            <div className="not-avatar-cont">
              <img className="not-avatar" src={not.from.profileImg} alt="" />
            </div>
          </div>
          <div className="not-text">
            <div>{not.from.fullName}</div>
            <div className="not-text-2">
              {not.type === "follow" ? "followed you" : "liked your post"}
            </div>
          </div>
        </div>
      ))}
      <div></div>
    </div>
  );
}
