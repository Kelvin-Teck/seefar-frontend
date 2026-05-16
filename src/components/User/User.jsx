import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import DefaultProfile from "../../img/profileImg.jpg";
import { UilMessage } from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";
import { createChat } from "../../api/chatRequest";

const User = ({ person }) => {
  const user = useAuthStore((state) => state.authData.user);
  const { followUser, unfollowUser } = useAuthStore();
  const [following, setFollowing] = useState(person.followers?.includes(user._id));
  const serverAssetsPublicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();

  const handleFollow = () => {
    following
      ? unfollowUser(person._id)
      : followUser(person._id);
    
    setFollowing(prev => !prev); 
  };

  const handleMessage = async () => {
    try {
      await createChat({ senderId: user._id, recieverId: person._id });
      navigate('/chat');
    } catch (error) {
      console.error(error);
      navigate('/chat');
    }
  };

  return (
    <div className="follower">
      <div>
        <img
          src={
            person.profilePicture
              ? serverAssetsPublicFolder + person.profilePicture
              : DefaultProfile
          }
          alt="Profile"
          className="followerImage"
        />
        <div className="name">
          <span>
            {person.firstname} {person.lastname}
          </span>
          <span>@{person.username}</span>
        </div>
      </div>

      <div className="userActionButtons">
        <div className="msgButton" onClick={handleMessage} title="Message">
          <UilMessage size={18} />
        </div>
        <button className={following ? "button fc-button unfollowButton" : "button fc-button"} onClick={handleFollow}>
          {following ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default User;
