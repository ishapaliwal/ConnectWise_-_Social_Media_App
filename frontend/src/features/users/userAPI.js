import API from "../../services/api";

export const getUserProfile = async () => {
  const res = await API.get("/users/profile");
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await API.put("/users/profile", data);
  return res.data;
};

export const updateUserProfileImage = async (formData) => {
  const res = await API.post("/users/profile/image", formData);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};