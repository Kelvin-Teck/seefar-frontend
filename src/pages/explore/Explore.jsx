import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import ProfileSide from "../../components/profileSide/ProfileSide";
import RightSide from "../../components/RightSide/RightSide";
import Post from "../../components/Post/Post";
import { getExplorePosts, getTrends } from "../../api/postRequest";
import { getAllUsers } from "../../api/userRequest";
import useAuthStore from "../../store/authStore";
import DefaultProfile from "../../img/profileImg.jpg";
import "./Explore.css";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'posts', 'creators', 'tags'
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.authData?.user);
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);
      try {
        const [postsRes, usersRes, trendsRes] = await Promise.all([
          getExplorePosts(),
          getAllUsers(),
          getTrends(),
        ]);
        setPosts(postsRes.data || []);
        setUsers(usersRes.data?.filter((u) => u._id !== currentUser?._id) || []);
        setTrends(trendsRes.data || []);
      } catch (error) {
        console.error("Explore fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, [currentUser?._id]);

  // Filter based on search query
  const q = queryParam.toLowerCase().trim();
  const filteredPosts = q
    ? posts.filter(
        (p) =>
          p.desc?.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q)
      )
    : posts;

  const filteredUsers = q
    ? users.filter(
        (u) =>
          u.firstname?.toLowerCase().includes(q) ||
          u.lastname?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q)
      )
    : users;

  const filteredTrends = q
    ? trends.filter((t) => t.name?.toLowerCase().includes(q))
    : trends;

  return (
    <div className="Explore">
      {/* Left Sidebar */}
      <ProfileSide />

      {/* Center Feed */}
      <div className="Explore-center">
        <div className="explore-header-card">
          <div className="explore-title">
            <span>✨</span>
            <span>{q ? `Search: "${queryParam}"` : "Explore Discovery"}</span>
          </div>
          <div className="explore-tabs">
            <button
              className={`explore-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              🔥 All Discovery
            </button>
            <button
              className={`explore-tab ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              📝 Posts ({filteredPosts.length})
            </button>
            <button
              className={`explore-tab ${activeTab === "creators" ? "active" : ""}`}
              onClick={() => setActiveTab("creators")}
            >
              👥 Creators ({filteredUsers.length})
            </button>
            <button
              className={`explore-tab ${activeTab === "tags" ? "active" : ""}`}
              onClick={() => setActiveTab("tags")}
            >
              🏷️ Hashtags ({filteredTrends.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "var(--gray)" }}>
            <h3>Exploring the Seefar network... ✨</h3>
          </div>
        ) : (
          <>
            {/* Creators Section */}
            {(activeTab === "all" || activeTab === "creators") && filteredUsers.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeTab === "all" && <h3 style={{ fontSize: "1.2rem" }}>👥 Featured Creators</h3>}
                <div className="explore-users-grid">
                  {filteredUsers.slice(0, activeTab === "all" ? 4 : 20).map((person) => (
                    <div key={person._id} className="explore-user-card">
                      <img
                        src={
                          person.profilePicture
                            ? publicFolder + person.profilePicture
                            : DefaultProfile
                        }
                        alt=""
                        className="explore-user-avatar"
                      />
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className="explore-user-name">
                          {person.firstname} {person.lastname}
                        </span>
                        <span className="explore-user-handle">@{person.username}</span>
                      </div>
                      <button
                        className="explore-btn"
                        onClick={() => navigate(`/profile/${person._id}`)}
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Tags Section */}
            {(activeTab === "all" || activeTab === "tags") && filteredTrends.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeTab === "all" && <h3 style={{ fontSize: "1.2rem" }}>🏷️ Viral Hashtags</h3>}
                <div className="explore-tags-grid">
                  {filteredTrends.map((tag, idx) => (
                    <div
                      key={idx}
                      className="explore-tag-card"
                      onClick={() => setSearchParams({ q: tag.name })}
                    >
                      <span className="explore-tag-name">#{tag.name}</span>
                      <span className="explore-tag-count">{tag.shares} trending posts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Section */}
            {(activeTab === "all" || activeTab === "posts") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeTab === "all" && <h3 style={{ fontSize: "1.2rem" }}>🔥 Popular Feed</h3>}
                {filteredPosts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray)" }}>
                    No posts matched your search.
                  </div>
                ) : (
                  filteredPosts.map((post) => <Post key={post._id} data={post} />)
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <RightSide />
    </div>
  );
};

export default Explore;
