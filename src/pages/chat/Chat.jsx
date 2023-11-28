import { useEffect, useState } from "react";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import "./Chat.css";
import { useSelector } from "react-redux";
import { userChats } from "../../api/chatRequest";
import Conversation from "../../components/Converastion/Conversation";
import { Link } from "react-router-dom";
import ChatBox from "../../components/ChatBox/ChatBox";

const Chat = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };

    getChats();
  }, []);

  return (
    <div className="Chat">
      {/* Left Side  */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={user._id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <div className="navIcons">
            <Link to="../home">
              <img src={Home} alt="home" />
            </Link>
            <UilSetting />
            <img src={Noti} alt="notifications" />
            <Link to={"/chat"}>
              <img src={Comment} alt="comments" />
            </Link>
          </div>

          {/* chat body */}

          <ChatBox chat={currentChat} currentuser={user._id} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
