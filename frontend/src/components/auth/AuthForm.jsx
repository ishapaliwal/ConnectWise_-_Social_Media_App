import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function AuthForm({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  type = "login",
  showRole = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" mb={2}>
        {type === "register" ? "Create Account" : "Log In"}
      </Typography>

      {type === "register" && (
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          margin="normal"
          required
        />
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={onChange}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showRole && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select name="role" value={formData.role} onChange={onChange}>
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      )}

      <Button
        variant="contained"
        fullWidth
        type="submit"
        disabled={loading === "pending"}
        sx={{ mt: 2 }}
      >
        {loading === "pending" ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : type === "register" ? (
          "Register"
        ) : (
          "Login"
        )}
      </Button>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
}