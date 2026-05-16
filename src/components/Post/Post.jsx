import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import notLike from "../../img/notlike.png";
import { useState, useEffect } from "react";
import { likePost } from "../../api/postRequest";
import { getUser } from "../../api/userRequest";
import useAuthStore from "../../store/authStore";
import { UilLocationPoint, UilSchedule } from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import DefaultProfile from "../../img/profileImg.jpg";

const Post = ({ data }) => {
  const user = useAuthStore((state) => state.authData?.user);
  const [liked, setLiked] = useState(data.likes?.includes(user?._id));
  const [likes, setLikes] = useState(data.likes?.length || 0);
  const [author, setAuthor] = useState(null);
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!data.userId) return;
      if (data.userId === user?._id) {
        setAuthor(user);
      } else {
        try {
          const res = await getUser(data.userId);
          setAuthor(res.data);
        } catch (err) {
          console.error("Post author fetch error:", err);
        }
      }
    };
    fetchAuthor();
  }, [data.userId, user]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    if (user?._id) {
      likePost(data._id, user._id);
    }
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const handleAuthorClick = () => {
    if (author?._id) {
      navigate(`/profile/${author._id}`);
    }
  };

  const isScheduled = data.scheduleDate && new Date(data.scheduleDate) > new Date();

  return (
    <div className="Post">
      {/* Premium Author & Timestamp Header */}
      <div className="postHeader">
        <div className="postAuthor" onClick={handleAuthorClick}>
          <img
            src={author?.profilePicture ? publicFolder + author.profilePicture : DefaultProfile}
            alt="Avatar"
            className="postAuthorAvatar"
          />
          <div className="postAuthorInfo">
            <span className="postAuthorName">
              {author ? `${author.firstname} ${author.lastname}` : data.name || "Anonymous"}
            </span>
            <span className="postAuthorHandle">
              @{author?.username || "user"}
            </span>
          </div>
        </div>
        <span className="postTime">
          {data.createdAt ? format(data.createdAt) : "Just now"}
        </span>
      </div>

      {data.image && (
        <img
          src={data.image.startsWith("http") ? data.image : publicFolder + data.image}
          alt="postimage"
          loading="lazy"
        />
      )}

      {data.video && (
        <video
          src={data.video.startsWith("http") ? data.video : publicFolder + data.video}
          controls
          className="postVideo"
        />
      )}

      {(data.location || isScheduled) && (
        <div className="postMetaTags">
          {data.location && (
            <div className="postMetaBadge" style={{ color: "var(--location)" }}>
              <UilLocationPoint size={16} />
              <span>{data.location}</span>
            </div>
          )}

          {isScheduled && (
            <div className="postMetaBadge" style={{ color: "var(--schedule)" }}>
              <UilSchedule size={16} />
              <span>Scheduled: {new Date(data.scheduleDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      <div className="detail">
        <span> {data.desc}</span>
      </div>

      <div className="postReact">
        <img
          src={liked ? Heart : notLike}
          alt="like/notlike"
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="comment" style={{ cursor: "pointer" }} />
        <img src={Share} alt="share" style={{ cursor: "pointer" }} />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px", fontWeight: "bold" }}>
        {likes} likes
      </span>
    </div>
  );
};

export default Post;
