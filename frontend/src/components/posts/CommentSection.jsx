import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
  Link,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, addComment } from "../../features/comment/commentSlice";
import { reportItem } from "../../features/moderation/moderationAPI";

export default function CommentSection({ postId }) {
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState("");

  const comments = useSelector(
    (state) => state.comments.commentsByPost[postId] || []
  );
  const loading = useSelector((state) => state.comments.loading);
  const currentUser = useSelector((state) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const open = Boolean(anchorEl);

  const reportReasons = [
    "Spam",
    "Harassment",
    "Inappropriate comment",
    "Hate speech",
    "Other",
  ];

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await dispatch(addComment({ postId, text: newComment.trim() }));
    setNewComment("");
    dispatch(fetchComments(postId));
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleReportReasonSelect = async (reason) => {
    try {
      await reportItem({
        report_type: "comment",
        target_id: selectedCommentId,
        reason,
        reported_by: currentUser?.id,
      });
      alert("Comment reported successfully.");
    } catch (err) {
      console.error("Error reporting comment:", err);
      alert("Failed to report comment.");
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="subtitle2" gutterBottom>
        Comments
      </Typography>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
      >
        <TextField
          size="small"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button variant="contained" type="submit" disabled={loading}>
          Post
        </Button>
      </form>

      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No comments yet.
        </Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment.id} mb={1}>
            <Divider />
            <Box display="flex" alignItems="center" mt={1}>
              <Link href={`/profile/user-${comment.user_id}`} underline="none">
                <Avatar
                  alt={comment.author}
                  src={comment.avatar_url}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
              </Link>
              <Box flexGrow={1}>
                <Typography variant="subtitle2">{comment.author}</Typography>
                <Typography variant="body2">{comment.text}</Typography>
              </Box>
              <Tooltip title="Report Comment">
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, comment.id)}
                >
                  <ReportIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {reportReasons.map((reason) => (
          <MenuItem
            key={reason}
            onClick={() => handleReportReasonSelect(reason)}
          >
            {reason}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}