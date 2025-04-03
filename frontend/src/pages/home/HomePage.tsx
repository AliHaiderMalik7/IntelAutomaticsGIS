import { useEffect, useState } from "react";
import Navbar from "../../components/Common/Navbar";
import MapboxMap from "../../components/Map/Map";
import { fetchProfile } from "../../api/getProfileApi";

const HomePage = () => {
  const token = localStorage.getItem("token"); 
  const [userDetails,setUserDetails] = useState<any>([])

  useEffect(() => {
    if (token) {
      fetchProfile().then((res) => {
        setUserDetails(res);
      });
    }
  }, []);

  return (
    <div className="" style={{}}>
      <Navbar user={userDetails}/>
      <MapboxMap data={userDetails?.layers}/>
    </div>
  );
};

export default HomePage;
