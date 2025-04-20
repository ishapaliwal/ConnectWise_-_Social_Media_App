import { useState } from "react";
import {
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Link,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { likePost, fetchLikesByPost } from "../../features/posts/postAPI";

export default function LikeButton({ postId, initialLikes, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked || false);
  const [likes, setLikes] = useState(Number(initialLikes) || 0);
  const [open, setOpen] = useState(false);
  const [likeUsers, setLikeUsers] = useState([]);

  const handleToggleLike = async () => {
    try {
      const newCount = await likePost(postId);
      setLiked(!liked);
      setLikes(newCount);
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  const handleOpenLikes = async () => {
    try {
      const users = await fetchLikesByPost(postId);
      setLikeUsers(users);
      setOpen(true);
    } catch (err) {
      console.error("Failed to fetch liked users", err);
    }
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleToggleLike}>
          {liked ? (
            <FavoriteIcon color="error" className="burst" />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
        <Typography variant="body2">{likes}</Typography>&nbsp;&nbsp;&nbsp;&nbsp;
        {likes > 0 && (
          <Link
            component="button"
            variant="body2"
            underline="hover"
            onClick={handleOpenLikes}
          >
            See who liked
          </Link>
        )}
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Liked by</DialogTitle>
        <DialogContent dividers>
          <List>
            {likeUsers.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar src={user.avatar_url} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}