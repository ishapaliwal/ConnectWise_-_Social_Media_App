import { Card, CardContent, Typography, Button, Box } from "@mui/material";

export default function ReportedCommentItem({ comment, onDelete, onIgnore }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Reported reason: {comment.reason}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          🗨️ Comment: "{comment.comment_text}"
        </Typography>
        <Typography variant="caption" color="text.secondary">
          📝 Post ID: {comment.post_id} | Content: "{comment.post_content}"
        </Typography>

        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => onIgnore(comment.comment_id)}
          >
            Ignore
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => onDelete(comment.comment_id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}