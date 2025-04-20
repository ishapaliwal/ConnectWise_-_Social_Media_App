const Chat = require("../models/Chat");

exports.getUserChats = async (req, res) => {
  const userId = req.user.id;
  try {
    const chats = await Chat.getUserChats(userId);
    const formatted = chats.map((chat) => ({
      userId: chat.user_id,
      name: chat.user_name,
      avatar: chat.avatar_url,
      lastMessage: chat.text,
      lastMessageTime: chat.created_at,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("Chat fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

exports.getChatMessages = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  try {
    const messages = await Chat.getChatMessages(userId, otherUserId);
    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { otherUserId } = req.params;
  const { text } = req.body;

  try {
    const message = await Chat.sendMessage(senderId, otherUserId, text);

    const addNotification = require("../utils/addNotification");
    await addNotification(
      otherUserId,
      "message",
      `${req.user.name} sent you a message`
    );

    res.status(201).json(message);
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};