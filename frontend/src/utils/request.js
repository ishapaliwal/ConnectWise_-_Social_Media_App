import { toast } from "react-toastify";

export const handleRequest = async (
  apiCall,
  successMsg = "",
  errorMsg = "Something went wrong"
) => {
  try {
    const result = await apiCall();
    if (successMsg) toast.success(successMsg);
    return result;
  } catch (error) {
    console.error(error);
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      errorMsg;

    toast.error(message);

    const enrichedError = new Error(message);
    enrichedError.status = error.response?.status;
    throw enrichedError;
  }
};