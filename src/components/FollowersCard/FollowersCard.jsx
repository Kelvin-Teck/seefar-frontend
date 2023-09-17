import "./FollowersCard.css";
import User from "../User/User";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../api/userRequest";

const FollowersCard = () => {
  const [persons, setPersons] = useState();
  const { user } = useSelector((state) => state.authReducer.authData);

  useEffect(() => {
    const fetchPersons = async () => {
      const { data } = await getAllUsers();
      setPersons(data);
      console.log(data);
    };

    fetchPersons();
  }, []);

  return (
    <div className="FollowerCard">
      <h3>People you may Know</h3>
      {persons?.map((person, id) => {
        if (person._id !== user._id) {
          return <User person={person} id={id} />;
        }
      })}
    </div>
  );
};

export default FollowersCard;
