import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  TextField,
  Autocomplete,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  ImageList,
  ImageListItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import {
  getAllUsers,
  fetchProfile,
  getUserById,
} from "../services/UserService";
import { fetchPostsByUser } from "../features/posts/postAPI";
import PostCard from "../components/posts/PostCard";
import { reportItem } from "../features/moderation/moderationAPI";
import "../styles/Timeline.scss";

const REPORT_REASONS = [
  "Inappropriate behavior",
  "Spam or misleading",
  "Harassment or bullying",
  "Fake account",
  "Other",
];

export default function Home() {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [viewedUser, setViewedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogPost, setDialogPost] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down(350));

  const isViewingOwnProfile =
    !userId || String(currentUser?.id) === String(userId);

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data));
  }, [location]);

  useEffect(() => {
    if (isViewingOwnProfile) {
      fetchProfile().then((res) => setViewedUser(res.data));
    } else {
      getUserById(userId).then((res) => setViewedUser(res.data));
    }
  }, [userId, currentUser]);

  useEffect(() => {
    const userToFetch = userId || currentUser?.id;
    if (userToFetch) {
      fetchPostsByUser(userToFetch)
        .then((res) => setPosts(res))
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setPosts([]);
        });
    }
  }, [userId, currentUser]);

  const handleUserSelect = (e, value) => {
    if (value) {
      setSelectedUser(value.id);
      navigate(`/home/${value.id}`);
    }
  };

  const handleReportClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleReportClose = () => {
    setAnchorEl(null);
  };

  const handleReportSubmit = async (reason) => {
    try {
      await reportItem({
        report_type: "user",
        target_id: viewedUser.id,
        reason,
        reported_by: currentUser.id,
      });
      alert("User reported successfully");
    } catch (err) {
      console.error("Error reporting user", err);
      alert("Failed to report user");
    } finally {
      handleReportClose();
    }
  };

  if (!viewedUser) return <Typography>Loading profile...</Typography>;

  return (
    <Box sx={{ maxWidth: "1000px", margin: "auto", p: 3 }}>
      <Card sx={{ display: "flex", alignItems: "center", p: 2, mb: 4 }}>
        <Avatar
          src={viewedUser.avatar_url}
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h5">{viewedUser.name}</Typography>
          {viewedUser.bio && (
            <Typography variant="body2">{viewedUser.bio}</Typography>
          )}
          {viewedUser.interests && (
            <Typography variant="body2" color="text.secondary">
              Interests: {viewedUser.interests}
            </Typography>
          )}
        </CardContent>
        {isViewingOwnProfile ? (
          <Button variant="contained" onClick={() => navigate("/profile")}>
            Edit Profile
          </Button>
        ) : (
          <>
            <Tooltip title="Report User">
              <IconButton onClick={handleReportClick}>
                <ReportIcon color="error" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleReportClose}
            >
              {REPORT_REASONS.map((reason) => (
                <MenuItem
                  key={reason}
                  onClick={() => handleReportSubmit(reason)}
                >
                  {reason}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Card>

      <Box sx={{ mb: 4 }}>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => option.name}
          onChange={handleUserSelect}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Avatar
                src={option.avatar_url}
                sx={{ width: 24, height: 24, mr: 1 }}
              />
              {option.name}
            </Box>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Select a friend" />
          )}
        />
      </Box>

      <Typography variant="h6" gutterBottom>
        {isViewingOwnProfile ? "Your Posts" : `${viewedUser.name}'s Posts`}
      </Typography>
      <ImageList
        variant="masonry"
        cols={isSmallScreen ? isExtraSmallScreen ? 1 : 2 : 3}
        gap={12}
        sx={{ margin: 0 }}
      >
        {posts.map((post) => (
          <ImageListItem
            key={post.id}
            onClick={() => setDialogPost(post)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={post.image_url}
              alt={post.content}
              loading="lazy"
              style={{ width: "100%", height: "300px", borderRadius: 8 }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog
        open={!!dialogPost}
        onClose={() => setDialogPost(null)}
        fullWidth
        maxWidth="sm"
      >
        {dialogPost && (
          <DialogContent sx={{ p: 0 }} style={{ padding: "1rem" }}>
            <PostCard post={dialogPost} />
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}