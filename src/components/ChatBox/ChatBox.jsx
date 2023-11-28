import React, { useEffect, useState } from "react";
import { getUser } from "../../api/userRequest";

const ChatBox = ({ chat, currentUser }) => {
    const [userData, setUserData] = useState(null);
    const [messages, setmessages] = useState([]);

  // fetching data for header of chat Box...
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);
    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                setmessages(data);
            } catch (error) {
                console.log(error);
            }
        }
    })
    

  return (
    <>
      <div className="ChatBox-container">
        <>
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER +
                        userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER +
                        "defaultProfile.png"
                  }
                  alt=""
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.8rem" }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
            <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
                  </div>
                  
                  {/* chat box Messages  */}

                  <div className="chat-body">
                      {chat?.messages?.map(message =>   ())}
                  </div>
        </>
      </div>
    </>
  );
};

export default ChatBox;
