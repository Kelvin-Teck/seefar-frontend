import './ProfileCard.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as userApi from '../../api/userRequest';
import useAuthStore from '../../store/authStore';
import usePostStore from '../../store/postStore';
import DefaultProfile from '../../img/profileImg.jpg';
import DefaultCover from '../../img/cover.jpg';

const ProfileCard = ({ location }) => {
  const currentUser = useAuthStore(state => state.authData?.user);
  const posts = usePostStore((state) => state.posts);
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const params = useParams();
  const profileUserId = params.id || currentUser?._id;
  const [user, setUser] = useState(currentUser || {});

  useEffect(() => {
    const fetchUser = async () => {
      if (!profileUserId) return;
      if (profileUserId === currentUser?._id) {
        setUser(currentUser);
      } else {
        try {
          const { data } = await userApi.getUser(profileUserId);
          setUser(data);
        } catch (error) {
          console.error("ProfileCard fetch error:", error);
        }
      }
    };
    fetchUser();
  }, [currentUser, profileUserId]);

  if (!user || Object.keys(user).length === 0) {
    return <div className="ProfileCard">Loading profile...</div>;
  }

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img
          src={user.coverPicture ? publicFolder + user.coverPicture : DefaultCover}
          alt="Cover"
        />
        <img
          src={user.profilePicture ? publicFolder + user.profilePicture : DefaultProfile}
          alt="Profile"
        />
      </div>

      <div className="ProfileName">
        <span>
          {user.firstname} {user.lastname}
        </span>
        <span>{user.worksAt ? user.worksAt : "Write about yourself..."}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{user.following?.length || 0}</span>
            <span>Following</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{user.followers?.length || 0}</span>
            <span>Followers</span>
          </div>
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{posts.filter(post => post.userId === user._id).length}</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link
            to={`/profile/${user._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            My Profile
          </Link>
        </span>
      )}
    </div>
  );
};

export default ProfileCard;