import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  Avatar,
  ListItemText,
} from "@mui/material";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";
import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";
import { reportItem } from "../../features/moderation/moderationAPI";
import { getAllUsers } from "../../features/users/userAPI";
import { sendMessage } from "../../features/chat/chatAPI";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function PostCard({ post, showLink = false }) {
  const currentUser = useSelector((state) => state.auth.user);
  const isValidImageUrl = (url) => typeof url === "string" && url.startsWith("http");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [shareOpen, setShareOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        const filtered = res.filter((u) => u.id !== currentUser.id);
        setUsers(filtered);
      } catch (err) {
        console.error("Error fetching users for sharing", err);
      }
    };
    fetchUsers();
  }, [currentUser.id]);

  const handleReportClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleReportReason = async (reason) => {
    try {
      await reportItem({
        report_type: "post",
        target_id: post.id,
        reason,
        reported_by: currentUser.id,
      });
      alert("Post reported successfully.");
    } catch (err) {
      console.error("Error reporting post:", err);
      alert("Failed to report post.");
    } finally {
      handleClose();
    }
  };

  const handleShareClick = () => setShareOpen(true);
  const handleShareClose = () => setShareOpen(false);

  const handleShareToUser = async (user) => {
    try {
      const message = JSON.stringify({
        type: "post_preview",
        post,
      });
      await sendMessage(user.id, message);
      alert(`Post shared with ${user.name}`);
      handleShareClose();
    } catch (err) {
      console.error("Error sharing post:", err);
      alert("Failed to share post.");
    }
  };

  const reportReasons = [
    "Spam",
    "Harassment",
    "Inappropriate content",
    "Hate speech",
    "Other",
  ];

  return (
    <Card sx={{ mb: 2 }}>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="stretch">
        {isValidImageUrl(post.image_url) && (
          <CardMedia
            component="img"
            image={post.image_url}
            alt="Post image"
            sx={{
              width: { xs: "100%", md: "50%" },
              objectFit: "cover",
              maxHeight: 400,
            }}
          />
        )}

        <CardContent sx={{ width: { xs: "100%", md: "50%" } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle2" color="text.secondary">
              {post.author || "Anonymous"}
            </Typography>

            <Box>
              <Tooltip title="Report Post">
                <IconButton size="small" onClick={handleReportClick}>
                  <ReportIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share Post">
                <IconButton size="small" onClick={handleShareClick}>
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {reportReasons.map((reason) => (
                <MenuItem key={reason} onClick={() => handleReportReason(reason)}>
                  {reason}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>

          <Box mt={1}>
            <LikeButton
              postId={post.id}
              initialLikes={post.like_count}
              initialLiked={post.liked_by_user}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {post.created_at && !isNaN(new Date(post.created_at))
                ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                : "Unknown time"}
            </Typography>
          </Box>

          <CommentSection postId={post.id} initialComments={post.comments || []} />
        </CardContent>
      </Box>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onClose={handleShareClose} fullWidth maxWidth="xs">
        <DialogTitle>Share this post with a user</DialogTitle>
        <List>
          {users.map((user) => (
            <ListItem button key={user.id} onClick={() => handleShareToUser(user)}>
              <Avatar src={user.avatar_url} sx={{ mr: 1 }} />
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>

      {showLink && (
        <Box textAlign="right" px={2} pb={2}>
          <a
            href={`/post/${post.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            🔗 View Full Post
          </a>
        </Box>
      )}
    </Card>
  );
}