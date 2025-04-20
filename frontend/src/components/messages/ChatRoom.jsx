import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getMessages, sendMessage } from "../../features/chat/chatAPI";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import '../../styles/Messages.scss';
import PostCard from "../posts/PostCard";

export default function ChatRoom({ user, onMessageSent }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!user) return;
    const msgs = await getMessages(user.id);
    const formatted = msgs.map((m) => ({
      ...m,
      fromSelf: Number(m.sender_id) === Number(currentUser?.id),
    }));
    setMessages(formatted);
  };

  useEffect(() => {
    fetchMessages();
  }, [user, currentUser]);

  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [user, currentUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    const newMsg = await sendMessage(user.id, text.trim());
    setMessages((prev) => [...prev, { ...newMsg, fromSelf: true }]);
    setText("");
    onMessageSent();
  };

  const renderMessage = (msg, index) => {
    let parsed = null;
    try {
      parsed = JSON.parse(msg.text);
    } catch (_) {}

    if (parsed?.type === "post_preview" && parsed?.post) {
      return (
        <Box sx={{ maxWidth: 400 }}>
          <PostCard post={parsed.post} showLink={true} />
          <div>Hey, check out this post!</div>
        </Box>
      );
    }

    return (
      <ListItemText
        primary={msg.text}
        sx={{
          maxWidth: "70%",
          backgroundColor: msg.fromSelf ? "#d1e7dd" : "#f8d7da",
          padding: "0.5rem 1rem",
          borderRadius: "10px",
        }}
      />
    );
  };

  return (
    <Box sx={{ maxWidth: "100%", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar src={user?.avatar_url} sx={{ mr: 2 }} />
        <Typography variant="h6">{user?.name || `User ${user?.id}`}</Typography>
      </Box>
      <Divider />
      <List sx={{ maxHeight: "65vh", overflowY: "auto", mt: 2 }}>
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            sx={{ justifyContent: msg.fromSelf ? "flex-end" : "flex-start" }}
          >
            {renderMessage(msg, index)}
          </ListItem>
        ))}
        <div ref={messageEndRef} />
      </List>

      <Box className="chat-send" sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message..."
          size="small"
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Box>
  );
}