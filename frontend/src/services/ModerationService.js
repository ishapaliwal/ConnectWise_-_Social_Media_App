import API from "./api";

export const fetchFlaggedPosts = () => API.get("/moderation/flagged-posts");
export const fetchReportedUsers = () => API.get("/moderation/reported-users");
export const fetchReportedComments = () => API.get("/moderation/reported-comments");

export const approvePost = (id) => API.post(`/moderation/posts/${id}/approve`);
export const deletePost = (id) => API.delete(`/moderation/posts/${id}`);

export const banUser = (id) => API.post(`/moderation/users/${id}/ban`);
export const ignoreUser = (id) => API.post(`/moderation/users/${id}/ignore`);

export const deleteComment = (id) => API.delete(`/moderation/comments/${id}`);
export const ignoreComment = (id) => API.post(`/moderation/comments/${id}/ignore`);