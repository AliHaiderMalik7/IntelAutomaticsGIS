import axios from "axios";

export const fetchProfile = async () => {
  const token = localStorage.getItem("token"); // Get token from localStorage

  if (!token) {
    console.error("No auth token found.");
    return;
  }

  try {
    const response = await axios.get(
      "http://44.244.10.225/api/account/profile/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    console.log("User Profile:", response.data);
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};