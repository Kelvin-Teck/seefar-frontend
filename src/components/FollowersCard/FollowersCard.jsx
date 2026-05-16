import "./FollowersCard.css";
import User from "../User/User";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/userRequest";
import useAuthStore from "../../store/authStore";

const FollowersCard = () => {
  const [persons, setPersons] = useState([]);
  const user = useAuthStore((state) => state.authData.user);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUsers();
        // Filter out current user and already followed users
        const filtered = data.filter((p) => p._id !== user._id && !user.following.includes(p._id));
        setPersons(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPersons();
  }, [user]);

  return (
    <div className="FollowerCard">
      <h3>People you may know</h3>
      {persons.length > 0 ? (
        persons.map((person, id) => (
          <User person={person} key={id} />
        ))
      ) : (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <span style={{ fontSize: "12px", color: "var(--gray)" }}>
            No suggestions for now...
          </span>
        </div>
      )}
    </div>
  );
};

export default FollowersCard;
