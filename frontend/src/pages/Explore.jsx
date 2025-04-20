import { useEffect, useState } from "react";
import { fetchPosts } from "../features/posts/postAPI";
import {
  Dialog,
  DialogContent,
  ImageList,
  ImageListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PostCard from "../components/posts/PostCard";
import "../styles/Timeline.scss";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down(250));

  useEffect(() => {
    const fetchFeed = async () => {
      const data = await fetchPosts();
      setPosts(data.reverse());
    };
    fetchFeed();
  }, []);

  const handleOpen = (post) => setSelectedPost(post);
  const handleClose = () => setSelectedPost(null);

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "auto" }}>
      <ImageList
        variant="masonry"
        cols={isSmallScreen ? isExtraSmallScreen ? 1 : 2 : 3}
        gap={12}
        sx={{ margin: 0 }}
      >
        {posts.map((post) => (
          <ImageListItem
            key={post.id}
            onClick={() => handleOpen(post)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={post.image_url}
              alt={post.content}
              loading="lazy"
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Dialog
        open={!!selectedPost}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          {selectedPost && <PostCard post={selectedPost} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}