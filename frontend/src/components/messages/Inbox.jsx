import { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInbox } from "../../features/chat/chatSlice";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

export default function Inbox() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inbox = useSelector((state) => state.chat.inbox);

  useEffect(() => {
    dispatch(fetchInbox());
  }, [dispatch]);

  const getMessagePreview = (message) => {
    try {
      const parsed = JSON.parse(message);
      if (parsed?.type === "post_preview") return "Shared a post with you";
    } catch (_) {}

    if (message?.startsWith("http")) return "Shared a link";
    return message?.slice(0, 100);
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    try {
      return formatDistanceToNowStrict(parseISO(timestamp), {
        addSuffix: true,
      });
    } catch {
      return "";
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <Typography variant="h5" gutterBottom>
        Messages
      </Typography>
      <List>
        {inbox.map((chat) => (
          <div key={chat.userId}>
            <ListItem
              onClick={() => navigate(`/chat/${chat.userId}`)}
              alignItems="flex-start"
              button
            >
              <ListItemAvatar>
                <Avatar alt={chat.name} src={chat.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1">{chat.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimeAgo(chat.lastMessageTime)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    sx={{ display: "inline" }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {getMessagePreview(chat.lastMessage)}
                  </Typography>
                }
              />
            </ListItem>
            <Divider component="li" />
          </div>
        ))}
      </List>
    </div>
  );
}