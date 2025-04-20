import API from './api';

export const uploadImageToS3 = async (file, firstname, lastname, id) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('identifier', id);

  const res = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.url;
};