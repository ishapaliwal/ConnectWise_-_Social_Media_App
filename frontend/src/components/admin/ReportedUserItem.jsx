import React from "react";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Grid,
  Box,
} from "@mui/material";

export default function ReportedUserItem({ user, onBan, onIgnore }) {
  return (
    <Card sx={{ mb: 3, p: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Reported reason: <strong>{user.reason}</strong>
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => onIgnore(user.id)}
          >
            Ignore
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onBan(user.id)}
          >
            Ban
          </Button>
        </Box>
      </Box>

      {/* Second Row: Avatar + Details */}
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            src={user.avatar_url}
            alt={user.name}
            sx={{ width: 60, height: 60 }}
          />
        </Grid>
        <Grid item xs>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}