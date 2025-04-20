import { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { fetchProfile } from "../../services/UserService";
import { uploadPostImage } from "../../services/PostService";

export default function CreatePost({ onSubmit }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !image) return;
    if (!user) return alert("User not loaded");

    let imageUrl = "";
    if (image) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", image);
        formData.append("name", user.name);
        formData.append("id", user.id);

        const res = await uploadPostImage(formData);

        imageUrl = res.data.url;
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Image upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    try {
      await onSubmit({
        user_id: user.id,
        content,
        image_url: imageUrl,
      });
      setContent("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error("Post creation failed:", err);
      alert("Post creation failed");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{backgroundColor: 'rgba(var(--bs-tertiary-bg-rgb), 1) !important'}}
      sx={{ p: 2, mb: 3, border: "1px solid #ddd", borderRadius: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Create a Post
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Stack direction="row" alignItems="center" style={{ justifyContent: 'space-between' }} spacing={2}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button type="submit" variant="contained" disabled={uploading}>
          {uploading ? "Uploading..." : "Post"}
        </Button>
      </Stack>
    </Box>
  );
}