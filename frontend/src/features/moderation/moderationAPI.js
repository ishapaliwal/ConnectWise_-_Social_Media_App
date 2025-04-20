import * as service from "../../services/ModerationService";
import API from "../../services/api";

export const getFlaggedPosts = async () => {
  const res = await service.fetchFlaggedPosts();
  return res.data;
};

export const getReportedUsers = async () => {
  const res = await service.fetchReportedUsers();
  return res.data;
};

export const getReportedComments = async () => {
  const res = await service.fetchReportedComments();
  return res.data;
};

export const approvePost = async (id) => {
  await service.approvePost(id);
};

export const deletePost = async (id) => {
  await service.deletePost(id);
};

export const banUser = async (id) => {
  await service.banUser(id);
};

export const ignoreUser = async (id) => {
  await service.ignoreUser(id);
};

export const deleteComment = async (id) => {
  await service.deleteComment(id);
};

export const ignoreComment = async (id) => {
  await service.ignoreComment(id);
};

export const reportItem = async ({ report_type, target_id, reason, reported_by }) => {
  const res = await API.post("/moderation/reports", { report_type, target_id, reason, reported_by });
  return res.data;
};