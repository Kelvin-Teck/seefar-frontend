import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import TrendCard from "../TrendCard/TrendCard";
import "./RightSide.css";
import { useState } from "react";
import ShareModal from "../ShareModal/ShareModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const user = useAuthStore((state) => state.authData?.user);

  return (
    <div className="RightSide">
      <div className="navIcons">
        <Link to="../home">
          <img src={Home} alt="home" />
        </Link>
        <UilSetting style={{ cursor: "pointer", color: "var(--gray)" }} onClick={() => setSettingsOpened(true)} />
        <img src={Noti} alt="notifications" />
        <Link to={"/chat"}>
          <img src={Comment} alt="comments" />
        </Link>
      </div>
      <TrendCard />
      <button className="button r-button" onClick={() => setModalOpened(true)}>
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
      {user && (
        <ProfileModal modalOpened={settingsOpened} setModalOpened={setSettingsOpened} data={user} />
      )}
    </div>
  );
};

export default RightSide;
