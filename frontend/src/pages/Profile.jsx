import { useState, useEffect } from "react";
import {
  fetchProfile,
  updateProfile,
  uploadProfileImage,
} from "../services/UserService";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetchProfile();
        setProfile({
          ...res.data,
          bio: res.data.bio || "",
          interests: res.data.interests || "",
        });
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const { name, bio, interests } = profile;
    try {
      const updated = await updateProfile({ name, bio, interests });
      setProfile((prev) => ({ ...prev, ...updated.data }));
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile?.id) return;
  
    const formData = new FormData();
    formData.append("avatar", file);
  
    try {
      const res = await uploadProfileImage(formData);
      setProfile((prev) => ({ ...prev, avatar_url: res.data.avatar_url }));
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };  

  if (loading || !profile)
    return (
      <Typography mt={4} align="center">
        Loading profile...
      </Typography>
    );

  return (
    <Box style={{ backgroundColor: 'rgba(var(--bs-tertiary-bg-rgb), 1) !important' }}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Your Profile
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar src={profile.avatar_url} sx={{ width: 80, height: 80 }} />
        <label htmlFor="upload-avatar">
          <input
            accept="image/*"
            id="upload-avatar"
            type="file"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <IconButton color="primary" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
      </Box>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={profile.name}
        onChange={handleChange}
        disabled={!editing}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={profile.email}
        disabled
        margin="normal"
      />
      <TextField
        fullWidth
        label="Bio"
        name="bio"
        value={profile.bio}
        onChange={handleChange}
        disabled={!editing}
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        fullWidth
        label="Interests"
        name="interests"
        value={profile.interests}
        onChange={handleChange}
        disabled={!editing}
        margin="normal"
      />

      {editing ? (
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
          Save Changes
        </Button>
      ) : (
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => setEditing(true)}
        >
          Edit Profile
        </Button>
      )}
    </Box>
  );
}