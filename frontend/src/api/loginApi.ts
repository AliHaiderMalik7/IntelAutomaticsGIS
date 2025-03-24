import axios from "axios";

const API_URL = "http://44.244.10.225/api/auth/login/";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { email, password });

    // Store token in localStorage/sessionStorage
    localStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "Login failed. Please try again.";
  }
};
