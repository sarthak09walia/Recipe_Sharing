import { useState, useEffect } from "react";
import axios from "axios";

const useGetUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [image, setImage] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          "http://127.0.0.1:8000/authentication/users/me/",
          {
            headers: headers,
          }
        );
        setName(response.data.name);
        setEmail(response.data.email);
        setId(response.data.id);
        setImage(response.data.image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);
  return { name, email, id, image };
};

export default useGetUser;
