import './ProfileCard.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



const ProfileCard = ({ location }) => {
  const { user } = useSelector(state => state.authReducer.authData);
  const { posts } = useSelector((state) => state.postReducer);
  console.log(user)
  
    const serverAssetsPublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  

  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img
          src={
            user.coverPicture
              ? serverAssetsPublicFolder + user.coverPicture
              : ""
          }
          alt=""
        />
        <img
          src={
            user.profilePicture
              ? serverAssetsPublicFolder + user.profilePicture
              : ""
          }
          alt=""
        />
      </div>

      <div className="ProfileName">
        <span>
          {user.firstname} {user.lastname}
        </span>
        <span>{user.worksAt ? user.worksAt : "write about yourself..."}</span>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow">
            <span>{user.following.length}</span>
            <span>following</span>
          </div>
          <div className="vl"></div>
          <div className="follow">
            <span>{user.followers.length}</span>
            <span>followers</span>
          </div>
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{ posts.filter(post => post.userId === user._id).length}</span>
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
}

export default ProfileCard