import axios from "axios";

export const fetchProfile = async () => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  if (!token) {
    console.error("No auth token found.");
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}account/profile/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};
