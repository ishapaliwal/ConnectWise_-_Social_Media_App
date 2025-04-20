import { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MailIcon from "@mui/icons-material/Mail";
import { formatDistanceToNow } from "date-fns";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAllRead,
} from "../../features/notifications/notificationSlice";
import {
  markAsRead,
  clearNotifications,
} from "../../features/notifications/notificationAPI";

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    dispatch(fetchNotifications());
  };

  const handleClear = async () => {
    await clearNotifications();
    dispatch(fetchNotifications());
  };

  const getIconForType = (type) => {
    if (type === "like") return <FavoriteIcon color="error" fontSize="small" />;
    if (type === "comment")
      return <ChatBubbleIcon color="primary" fontSize="small" />;
    if (type === "message") return <MailIcon color="action" fontSize="small" />;
    return null;
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} color="inherit">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{ style: { width: 300 } }}
      >
        <Box px={2} pt={1}>
          <Typography variant="subtitle1">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>No new notifications</MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              selected={!n.read}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {getIconForType(n.type)}
              <Box>
                <Typography variant="body2">{n.text}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(n.created_at), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
        <Divider />
        <Box px={2} pb={1} display="flex" justifyContent="space-between">
          <Button size="small" onClick={handleClear}>
            Clear All
          </Button>
          <Button size="small" onClick={() => dispatch(fetchNotifications())}>
            Refresh
          </Button>
        </Box>
      </Menu>
    </Box>
  );
}