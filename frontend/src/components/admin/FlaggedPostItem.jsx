import { Box, Typography, Button } from "@mui/material";

export default function FlaggedPostItem({ post, onApprove, onDelete }) {
  return (
    <Box
      style={{
        backgroundColor: "#fff",
        boxShadow:
          "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
        border: "none",
      }}
      sx={{ p: 2, mb: 2 }}
    >
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Reported reason: {post.reason}
      </Typography>
      <Typography variant="body1">{post.content}</Typography>
      <Typography variant="caption" color="text.secondary">
        Reported by: {post.reported_by}
      </Typography>
      <Box mt={1} display="flex" gap={1}>
        <Button variant="outlined" onClick={() => onApprove(post.id)}>
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(post.id)}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}