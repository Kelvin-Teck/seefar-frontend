import { useDispatch, useSelector } from "react-redux";
import Post from "../Post/Post";
import "./Posts.css";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getTimelinePosts } from "../../actions/postAction";

const Posts = () => {
  const dispatch = useDispatch();
  const params = useParams()
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);
  
  useEffect(() => {
    dispatch(getTimelinePosts(user._id));
  }, [])

  if (!posts) return "No posts to display...";
  if(params.id) posts = posts.filter(post => post.userId === params._id)


  return (
    <div className="Posts">
      {
       loading ? "Fetching Posts..." :  posts.map((post, id) => {
        return <Post data={post} id={id} />;
      })}
    </div>
  );
};

export default Posts;
