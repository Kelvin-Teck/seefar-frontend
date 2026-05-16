import React, { useState } from "react";
import "./PostShare.css";
import { UilScenery, UilPlayCircle, UilLocationPoint, UilSchedule } from "@iconscout/react-unicons";
import useAuthStore from "../../store/authStore";
import DefaultProfile from "../../img/profileImg.jpg";
import ShareModal from "../ShareModal/ShareModal";

const PostShare = () => {
  const user = useAuthStore((state) => state.authData.user);
  const serverAssetsPublicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="PostShareTrigger">
      <div className="triggerMain">
        <img
          src={user.profilePicture ? serverAssetsPublicFolder + user.profilePicture : DefaultProfile}
          alt="Profile"
        />
        <div className="searchBar" onClick={() => setModalOpened(true)}>
          What's on your mind, {user.firstname}?
        </div>
      </div>
      
      <div className="triggerActions">
        <div className="triggerOption" onClick={() => setModalOpened(true)}>
          <UilScenery style={{ color: "var(--photo)" }} />
          <span>Photo</span>
        </div>
        <div className="triggerOption" onClick={() => setModalOpened(true)}>
          <UilPlayCircle style={{ color: "var(--video)" }} />
          <span>Video</span>
        </div>
        <div className="triggerOption" onClick={() => setModalOpened(true)}>
          <UilLocationPoint style={{ color: "var(--location)" }} />
          <span>Location</span>
        </div>
        <div className="triggerOption" onClick={() => setModalOpened(true)}>
          <UilSchedule style={{ color: "var(--schedule)" }} />
          <span>Schedule</span>
        </div>
      </div>

      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
    </div>
  );
};

export default PostShare;
