import { Modal, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadImage } from "../../api/uploadRequest";
import { updateUser } from "../../actions/userAction";

function ProfileModal({ modalOpened, setModalOpened, data }) {
  const theme = useMantineTheme();
  const { password, ...others } = data;

  const [formData, setFormData] = useState(others);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();
  const { user } = useSelector((state) => state.authReducer.authData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      console.log(img);
      e.target.name === "profileImage"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let userData = formData;

    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);

      userData.profilePicture = fileName;

      try {
        dispatch(uploadImage(data));
      } catch (error) {
        console.log(error);
      }
    }

    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append("name", fileName);
      data.append("file", coverImage );

      userData.coverPicture = fileName;

      try {
        dispatch(uploadImage(data));
      } catch (error) {
        console.log(error);
      }
    }

    dispatch(updateUser(params.id, userData))
    setModalOpened(false);
  };

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <form className="infoForm">
        <h3>Your info</h3>

        <div>
          <input
            type="text"
            className="infoInput"
            name="FirstName"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
          />

          <input
            type="text"
            className="infoInput"
            name="LastName"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="worksAt"
            placeholder="Works at"
            value={formData.worksAt}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="livesIn"
            placeholder="LIves in"
            value={formData.livesIn}
            onChange={handleChange}
          />

          <input
            type="text"
            className="infoInput"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="relationship"
            className="infoInput"
            placeholder="RelationShip Status"
            value={formData.relationship}
            onChange={handleChange}
          />
        </div>

        <div>
          Profile Image
          <input type="file" name="profileImage" onChange={onImageChange} />
          Cover Image
          <input type="file" name="coverImage" onChange={onImageChange} />
        </div>

        <button className="button infoButton" onClick={handleSubmit}>
          Update
        </button>
      </form>
    </Modal>
  );
}

export default ProfileModal;
