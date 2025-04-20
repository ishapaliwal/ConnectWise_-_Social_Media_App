import "./App.scss";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import CreatePostPage from "./pages/CreatePostPage";
import Inbox from "./components/messages/Inbox";
import ChatRoom from "./components/messages/ChatRoom";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import Messages from "./pages/Messages";
import SinglePost from "./pages/SinglePost";
import NavBar from "./components/common/NavBar";
import { useEffect } from "react";
import {
  checkAuthStatus,
  selectInitialCheckDone,
} from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const initialCheckDone = useSelector(selectInitialCheckDone);

  const showNav =
    isAuthenticated &&
    location.pathname !== "/login" &&
    location.pathname !== "/register";

  if (!initialCheckDone) {
    return (
      <div className="auth-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      {showNav && <NavBar />}
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={location.state?.from || "/"} />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={location.state?.from || "/"} />
            ) : (
              <Register />
            )
          }
        />

        {/* Auth-only routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/home/:userId" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:userId" element={<Messages />} />
            <Route path="/post/:postId" element={<SinglePost />} />
            <Route path="/messages" element={<Inbox />} />
            <Route path="/chat/:userId" element={<ChatRoom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />

            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={
                isAdmin ? <AdminDashboard /> : <Navigate to="/unauthorized" />
              }
            />
          </>
        ) : (
          <Route
            path="*"
            element={
              <Navigate to="/login" state={{ from: location.pathname }} />
            }
          />
        )}

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;