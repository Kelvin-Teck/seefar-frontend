import { useEffect, useState, useRef } from "react";
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/comment.png";
import { UilSetting } from "@iconscout/react-unicons";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import "./Chat.css";
import { userChats, createChat } from "../../api/chatRequest";
import { getAllUsers } from "../../api/userRequest";
import Conversation from "../../components/Converastion/Conversation";
import { Link } from "react-router-dom";
import ChatBox from "../../components/ChatBox/ChatBox";
import useAuthStore from "../../store/authStore";
import ProfileModal from "../../components/ProfileModal/ProfileModal";
import DefaultProfile from "../../img/profileImg.jpg";
import { io } from "socket.io-client";

const Chat = () => {
  const user = useAuthStore((state) => state.authData?.user);
  const [chats, setChats] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  // Connect to Socket.io
  useEffect(() => {
    if (user?._id) {
      const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      socket.current = io(socketUrl);
      socket.current.emit("new-user-add", user._id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.current?.disconnect();
      };
    }
  }, [user?._id]);

  // Send Message to socket
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current?.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Receive Message from socket
  useEffect(() => {
    socket.current?.on("receive-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  useEffect(() => {
    const getChatsAndUsers = async () => {
      if (!user?._id) return;
      try {
        const { data: chatData } = await userChats(user._id);
        setChats(chatData);

        // Fetch available users to message if chat list is empty
        if (chatData.length === 0) {
          const { data: userData } = await getAllUsers();
          setAvailableUsers(userData.filter((u) => u._id !== user._id));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getChatsAndUsers();
  }, [user?._id]);

  const handleStartChat = async (receiverId) => {
    try {
      const { data } = await createChat({ senderId: user._id, recieverId: receiverId });
      const existing = chats.find((c) => c._id === data._id);
      if (existing) {
        setCurrentChat(existing);
      } else {
        setChats([data, ...chats]);
        setCurrentChat(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members?.find((member) => String(member) !== String(user?._id));
    const online = onlineUsers.find((u) => String(u.userId) === String(chatMember));
    return online ? true : false;
  };

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
                <Conversation data={chat} currentUserId={user?._id} online={checkOnlineStatus(chat)} />
              </div>
            ))}

            {/* Empty State: Available Connections to Start Messaging */}
            {chats.length === 0 && availableUsers.length > 0 && (
              <div className="availableConnections">
                <span style={{ fontSize: "0.85rem", color: "var(--gray)", padding: "0 4px" }}>
                  No active chats. Start a conversation:
                </span>
                {availableUsers.map((person) => (
                  <div
                    key={person._id}
                    className="availableUserCard"
                    onClick={() => handleStartChat(person._id)}
                  >
                    <img
                      src={
                        person.profilePicture
                          ? publicFolder + person.profilePicture
                          : DefaultProfile
                      }
                      alt=""
                      style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div className="name" style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                      <span>{person.firstname} {person.lastname}</span>
                      <span style={{ color: "var(--orange)", fontSize: "0.75rem", display: "block", marginTop: "2px", fontWeight: "normal" }}>
                        Click to Chat 💬
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div className="navIcons chatNavIcons">
          <Link to="../home">
            <img src={Home} alt="home" />
          </Link>
          <UilSetting style={{ cursor: "pointer", color: "var(--gray)" }} onClick={() => setSettingsOpened(true)} />
          <img src={Noti} alt="notifications" />
          <Link to={"/chat"}>
            <img src={Comment} alt="comments" />
          </Link>
        </div>

        {/* chat body */}
        <ChatBox
          chat={currentChat}
          currentUserId={user?._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
      {user && (
        <ProfileModal modalOpened={settingsOpened} setModalOpened={setSettingsOpened} data={user} />
      )}
    </div>
  );
};

export default Chat;
