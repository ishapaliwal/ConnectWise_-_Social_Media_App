import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MailIcon from "@mui/icons-material/Mail";
import { formatDistanceToNow } from "date-fns";

export default function NotificationItem({ notification }) {
  const { type, text, created_at, read } = notification;

  const getIcon = () => {
    if (type === "like") return <FavoriteIcon color="error" />;
    if (type === "comment") return <ChatBubbleIcon color="primary" />;
    if (type === "message") return <MailIcon color="action" />;
    return null;
  };

  return (
    <ListItem
      sx={{
        bgcolor: read ? "background.paper" : "#f0f0f0",
        mb: 1,
        borderRadius: 1,
      }}
    >
      <ListItemIcon>{getIcon()}</ListItemIcon>
      <ListItemText
        primary={<Typography variant="body2">{text}</Typography>}
        secondary={
          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </Typography>
        }
      />
    </ListItem>
  );
}