import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth/Auth";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import Explore from "./pages/explore/Explore";
import useAuthStore from "./store/authStore";

function App() {
  const user = useAuthStore((state) => state.authData);

  return (
    <div className="app">
      <div className="blur" style={{ top: "-18%", right: "0" }}></div>
      <div className="blur" style={{ top: "36%", left: "-8rem" }}></div>

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="../auth" />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="../auth" />}
        />
        <Route
          path="/explore"
          element={user ? <Explore /> : <Navigate to="../auth" />}
        />
      </Routes>
    </div>
  );
}

export default App;
