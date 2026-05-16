import React, { useEffect, useState, useRef } from "react";
import { getUser } from "../../api/userRequest";
import { getMessages, addMessage } from "../../api/messageRequest";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import DefaultProfile from "../../img/profileImg.jpg";
import "./ChatBox.css";

const ChatBox = ({ chat, currentUserId, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  // Fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (chat !== null && userId) getUserData();
  }, [chat, currentUserId]);

  // Fetching messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Receive message from parent socket
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat?._id) {
      setMessages((prev) => [...prev, receivedMessage]);
    }
  }, [receivedMessage, chat?._id]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };
    try {
      const { data } = await addMessage(message);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");

      // Send message to socket server
      const receiverId = chat.members?.find((id) => id !== currentUserId);
      if (receiverId && setSendMessage) {
        setSendMessage({ ...data, receiverId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <img
                    src={
                      userData?.profilePicture
                        ? publicFolder + userData.profilePicture
                        : DefaultProfile
                    }
                    alt=""
                    className="followerImage"
                    style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div className="name" style={{ fontSize: "0.95rem", fontWeight: "bold" }}>
                    <span>
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-body">
              {messages.map((message, index) => (
                <div
                  ref={index === messages.length - 1 ? scrollRef : null}
                  key={message._id || index}
                  className={
                    message.senderId === currentUserId
                      ? "message own"
                      : "message"
                  }
                >
                  <span>{message.text}</span>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="chat-sender">
              <InputEmoji
                value={newMessage}
                onChange={setNewMessage}
                onEnter={handleSend}
                cleanOnEnter
                placeholder="Type a message..."
              />
              <div className="send-button button" onClick={handleSend}>Send</div>
            </div>
          </>
        ) : (
          <div className="chatbox-empty-state">
            <span style={{ fontSize: "3.5rem" }}>💬</span>
            <span className="empty-title">Select a conversation</span>
            <span className="empty-sub">Choose an existing chat or start a new conversation from the sidebar to connect with people.</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatBox;
