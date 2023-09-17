import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import notLike from "../../img/notlike.png";
import { useSelector } from "react-redux";
import { useState } from "react";
import { likePost } from "../../api/postRequest";

const Post = ({ data, id }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);

  const handleLike = () => {
    setLiked((prev) => !prev);
    likePost(data._id, user._id);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  return (
    <div key={id} className="Post">
      <img
        src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""}
        alt="postimage"
      />
      <div className="detail">
        <span>
          <b>{data.name}</b>
        </span>
        <span> {data.desc}</span>
      </div>

      <div className="postReact">
        <img
          src={liked ? Heart : notLike}
          alt="like/notlike"
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="comment" />
        <img src={Share} alt="share" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
    </div>
  );
};

export default Post;
