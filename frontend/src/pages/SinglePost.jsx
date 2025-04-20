import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../features/posts/postAPI";
import { Box, Typography, CircularProgress } from "@mui/material";
import PostCard from "../components/posts/PostCard";

export default function SinglePost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (postId) {
      getPostById(postId)
        .then((res) => {
          setPost(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch post", err);
          setLoading(false);
        });
    }
  }, [postId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Post not found or an error occurred.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", mt: 4 }}>
      <PostCard post={post} />
    </Box>
  );
}