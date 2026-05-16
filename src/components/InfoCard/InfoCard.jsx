import React, { useEffect, useState } from "react";
import "./InfoCard.css";
import { UilPen, UilMessage } from "@iconscout/react-unicons";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useParams, useNavigate } from "react-router-dom";
import * as userApi from '../../api/userRequest';
import { createChat } from "../../api/chatRequest";
import useAuthStore from "../../store/authStore";

const InfoCard = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.authData?.user);
  const { logout, followUser, unfollowUser } = useAuthStore();
  const profileUserId = params.id || user?._id;
  const [profileUser, setProfileUser] = useState(user || {});
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (!profileUserId) return;
      if (profileUserId === user?._id) {
        setProfileUser(user);
        setFollowing(false);
      } else {
        try {
          const { data } = await userApi.getUser(profileUserId);
          setProfileUser(data);
          setFollowing(data.followers?.includes(user?._id) || false);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchProfileUser();
  }, [user, profileUserId]);

  const handleLogOut = () => {
    logout();
  };

  const handleFollow = () => {
    if (following) {
      unfollowUser(profileUserId);
    } else {
      followUser(profileUserId);
    }
    setFollowing((prev) => !prev);
  };

  const handleMessage = async () => {
    try {
      await createChat({ senderId: user._id, recieverId: profileUserId });
      navigate('/chat');
    } catch (error) {
      console.error(error);
      navigate('/chat');
    }
  };

  const isOwnProfile = user?._id === profileUserId;

  return (
    <div className="InfoCard">
      <div className="infoHead">
        <h4>{isOwnProfile ? "Your Info" : `${profileUser.firstname || "User"}'s Info`}</h4>
        {isOwnProfile ? (
          <div>
            <UilPen
              width="2rem"
              height="1.2rem"
              onClick={() => setModalOpened(true)}
              style={{ cursor: "pointer" }}
            />
            <ProfileModal
              modalOpened={modalOpened}
              setModalOpened={setModalOpened}
              data={user}
            />
          </div>
        ) : null}
      </div>

      <div className="info">
        <span>
          <b>Status </b>
        </span>
        <span>{profileUser.relationship || "Single"}</span>
      </div>

      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{profileUser.livesIn || "New York, USA"}</span>
      </div>

      <div className="info">
        <span>
          <b>Works at </b>
        </span>
        <span>{profileUser.worksAt || "Seefar Inc."}</span>
      </div>

      {isOwnProfile ? (
        <button className="button logout-button" onClick={handleLogOut}>Logout</button>
      ) : (
        <div className="info-action-btns">
          <button
            className={`info-btn info-follow-btn ${following ? "unfollowing" : ""}`}
            onClick={handleFollow}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
          <button
            className="info-btn info-msg-btn"
            onClick={handleMessage}
          >
            <UilMessage size={18} /> Message
          </button>
        </div>
      )}
    </div>
  );
};

export default InfoCard;
