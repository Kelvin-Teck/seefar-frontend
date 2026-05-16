import Post from "../Post/Post";
import "./Posts.css";
import { useEffect, useRef, useCallback } from "react";
import { useParams } from 'react-router-dom';
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";

const Posts = () => {
  const params = useParams();
  const user = useAuthStore((state) => state.authData.user);
  let { posts, loading, getTimelinePosts, hasMore } = usePostStore();
  const observer = useRef();

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        getTimelinePosts(user._id, true);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, getTimelinePosts, user._id]);

  useEffect(() => {
    // Initial fetch
    getTimelinePosts(user._id);
  }, [user._id, getTimelinePosts]);

  if (!posts) return "No posts to display...";
  
  let displayedPosts = posts;
  if(params.id) displayedPosts = posts.filter(post => post.userId === params.id);

  return (
    <div className="Posts">
      {displayedPosts.map((post, index) => {
        if (displayedPosts.length === index + 1) {
          return (
            <div ref={lastPostElementRef} key={post._id || index}>
              <Post data={post} />
            </div>
          );
        } else {
          return <Post data={post} key={post._id || index} />;
        }
      })}
      {loading && <div style={{ textAlign: "center", padding: "1rem" }}>Fetching more posts...</div>}
      {!hasMore && displayedPosts.length > 0 && (
        <div style={{ textAlign: "center", padding: "1rem", color: "var(--gray)" }}>
          You've reached the end of the timeline!
        </div>
      )}
    </div>
  );
};

export default Posts;
