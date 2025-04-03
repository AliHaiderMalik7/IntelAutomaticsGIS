import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/login/`, {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Login failed. Please try again.";
  }
};
