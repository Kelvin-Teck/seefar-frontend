import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unFollowUser } from "../../actions/userAction";

const User = ({ person, id }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  console.log(user )
  const [following, setFollowing] = useState(person.followers.includes(user._id));
  const serverAssetsPublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const dispatch = useDispatch();

  const handleFollow = () => {
    following
      ? dispatch(unFollowUser(person._id, user))
      : dispatch(followUser(person._id, user));
    
    setFollowing(prev => !prev); 
  };

  return (
    <div className="follower">
      <div key={id}>
        <img
          src={
            person.profilePicture
              ? serverAssetsPublicFolder + person.profilePicture
              : ""
          }
          alt=""
          className="followerImage"
        />
        <div className="name">
          <span>
            {person.firstname} {person.lastname}
          </span>
          <span>@{person.username}</span>
        </div>
      </div>
      <button className={following ? "button fc-button unfollowButton" : "button fc-button"} onClick={handleFollow}>
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
