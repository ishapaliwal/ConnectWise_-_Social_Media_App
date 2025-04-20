import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { fetchInbox } from "../features/chat/chatSlice";
import ChatRoom from "../components/messages/ChatRoom";
import UserSearch from "../components/messages/UserSearch";
import { getAllUsers } from "../services/UserService";
import '../styles/Messages.scss';

export default function Messages() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const inbox = useSelector((state) => state.chat.inbox);

  const [allUsers, setAllUsers] = useState([]);
  const [additionalUsers, setAdditionalUsers] = useState([]);
  const [lastSelectedUserId, setLastSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchInbox());
    getAllUsers()
      .then((res) => setAllUsers(res.data))
      .catch(console.error);
  }, [dispatch]);

  const findUserById = (id) => allUsers.find((u) => u.id === Number(id));

  const handleUserSelect = (user) => {
    setLastSelectedUserId(user.id);
    if (
      !inbox.find((u) => u.userId === user.id) &&
      !additionalUsers.find((u) => u.userId === user.id)
    ) {
      setAdditionalUsers((prev) => [
        ...prev,
        {
          userId: user.id,
          name: user.name,
          avatar: user.avatar_url,
          lastMessage: "",
        },
      ]);
    }
    navigate(`/messages/${user.id}`);
  };

  const mergedInbox = [...additionalUsers, ...inbox].filter(
    (v, i, self) => i === self.findIndex((u) => u.userId === v.userId)
  );

  useEffect(() => {
    if (lastSelectedUserId && userId && String(lastSelectedUserId) !== String(userId)) {
      setAdditionalUsers((prev) => prev.filter((u) => String(u.userId) === String(userId)));
    }
  }, [userId]);

  const handleMessageSent = () => {
    dispatch(fetchInbox());
  };

  const selectedUser = findUserById(userId);

  return (
    <Grid container sx={{ height: "85vh", mt: 4 }}>
      <Grid className="inbox-panel"
        item
        xs={12}
        md={6}
        sx={{ borderRight: "1px solid #ccc", overflowY: "auto" }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Messages
        </Typography>
        <UserSearch onUserSelect={handleUserSelect} />

        <List>
          {mergedInbox.map((chat) => (
            <ListItem
              key={chat.userId}
              button
              selected={String(chat.userId) === String(userId)}
              onClick={() => navigate(`/messages/${chat.userId}`)}
              sx={{
                backgroundColor:
                  String(chat.userId) === String(userId) ? "#f0f0f0" : "inherit",
              }}
            >
              <ListItemAvatar>
                <Avatar src={chat.avatar || findUserById(chat.userId)?.avatar_url} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  chat.name ||
                  findUserById(chat.userId)?.name ||
                  `User ${chat.userId}`
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {chat.lastMessage}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid item xs={12} md={6} sx={{ p: 2}} className="chat-panel">
        {userId ? (
          <ChatRoom onMessageSent={handleMessageSent} user={selectedUser} />
        ) : (
          <div className="void-chat">
            <img
              src="/chat-placeholder.svg"
              alt="Start chat"
              style={{ maxWidth: 160, marginBottom: 20 }}
            />
            <Typography variant="h6">
              Select a conversation to start chatting
            </Typography>
          </div>
        )}
      </Grid>
    </Grid>
  );
}