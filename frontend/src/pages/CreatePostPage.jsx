import CreatePost from "../components/posts/CreatePost";
import { createPost } from "../services/PostService";

export default function CreatePostPage() {
  const handleCreatePost = async (post) => {
    try {
      const response = await createPost(post);
      console.log("Post created:", response.data);
      alert("Post created!");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Create Post</h2>
      <CreatePost onSubmit={handleCreatePost} />
    </div>
  );
}