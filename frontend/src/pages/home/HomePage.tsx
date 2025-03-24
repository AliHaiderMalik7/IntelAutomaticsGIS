import { useEffect } from "react";
import Navbar from "../../components/Common/Navbar";
import MapboxMap from "../../components/Map/Map";
import { fetchProfile } from "../../api/getProfileApi";

const HomePage = () => {
  const token = localStorage.getItem("token"); // Get token from localStorage

  useEffect(() => {
    if (token) {
fetchProfile()    }
  }, []);

  return (
    <div className="" style={{}}>
      <Navbar />
      <MapboxMap />
    </div>
  );
};

export default HomePage;
