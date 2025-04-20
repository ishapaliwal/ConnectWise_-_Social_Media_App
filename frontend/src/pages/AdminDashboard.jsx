import { useEffect, useState } from "react";
import {
  getFlaggedPosts,
  getReportedUsers,
  getReportedComments,
  deletePost,
  approvePost,
  banUser,
  ignoreUser,
  deleteComment,
  ignoreComment,
} from "../features/moderation/moderationAPI";

import { Typography, Box, Divider } from "@mui/material";
import FlaggedPostItem from "../components/admin/FlaggedPostItem";
import ReportedUserItem from "../components/admin/ReportedUserItem";
import ReportedCommentItem from "../components/admin/ReportedCommentItem";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  const loadModerationData = async () => {
    const [p, u, c] = await Promise.all([
      getFlaggedPosts(),
      getReportedUsers(),
      getReportedComments(),
    ]);
    setPosts(p);
    setUsers(u);
    setComments(c);
  };

  useEffect(() => {
    loadModerationData();
  }, []);

  // --- Post Actions ---
  const handleApprove = async (id) => {
    await approvePost(id);
    loadModerationData();
  };

  const handleDeletePost = async (id) => {
    await deletePost(id);
    loadModerationData();
  };

  // --- User Actions ---
  const handleBanUser = async (id) => {
    await banUser(id);
    loadModerationData();
  };

  const handleIgnoreUser = async (id) => {
    await ignoreUser(id);
    loadModerationData();
  };

  // --- Comment Actions ---
  const handleDeleteComment = async (id) => {
    await deleteComment(id);
    loadModerationData();
  };

  const handleIgnoreComment = async (id) => {
    await ignoreComment(id);
    loadModerationData();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Moderation Panel
      </Typography>

      {/* Flagged Posts */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Flagged Posts</Typography>
      {posts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No flagged posts.
        </Typography>
      ) : (
        posts.map((post) => (
          <FlaggedPostItem
            key={post.id}
            post={post}
            onApprove={handleApprove}
            onDelete={handleDeletePost}
          />
        ))
      )}

      {/* Reported Users */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Reported Users</Typography>
      {users.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No reported users.
        </Typography>
      ) : (
        users.map((user) => (
          <ReportedUserItem
            key={user.id}
            user={user}
            onBan={handleBanUser}
            onIgnore={handleIgnoreUser}
          />
        ))
      )}

      {/* Reported Comments */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Reported Comments</Typography>
      {comments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No reported comments.
        </Typography>
      ) : (
        comments.map((comment) => (
          <ReportedCommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDeleteComment}
            onIgnore={handleIgnoreComment}
          />
        ))
      )}
    </Box>
  );
}