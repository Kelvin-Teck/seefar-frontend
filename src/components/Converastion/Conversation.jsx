import React, { useEffect, useState } from "react";
import { getUser } from "../../api/userRequest";
import DefaultProfile from "../../img/profileImg.jpg";

const Conversation = ({ data, currentUserId, online }) => {
  const [userData, setUserData] = useState(null);
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUserId);

    const getUserData = async () => {
      if (!userId) return;
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [data, currentUserId]);

  return (
    <>
      <div className="follower conversation">
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {online && <div className="online-dot"></div>}
          <img
            src={
              userData?.profilePicture
                ? publicFolder + userData.profilePicture
                : DefaultProfile
            }

            alt=""
            className="followerImage"
            style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div className="name" style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
            <span>
              {userData?.firstname} {userData?.lastname}
            </span>
            <span style={{ color: online ? "#51e200" : "var(--gray)", fontSize: "0.75rem", fontWeight: "normal", display: "block", marginTop: "2px" }}>
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
      <hr style={{ width: '85%', border: '0.1px solid var(--hrColor)', margin: "5px auto" }} />
    </>
  );
};

export default Conversation;
