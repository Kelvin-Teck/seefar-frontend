import { Modal, useMantineTheme } from "@mantine/core";
import { useState, useRef } from "react";
import useAuthStore from "../../store/authStore";
import { UilCloudUpload, UilUserSquare, UilScenery } from "@iconscout/react-unicons";
import "./ProfileModal.css";

function ProfileModal({ modalOpened, setModalOpened, data }) {
  const theme = useMantineTheme();
  const { password, ...others } = data;

  const [formData, setFormData] = useState(others);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [draggingProfile, setDraggingProfile] = useState(false);
  const [draggingCover, setDraggingCover] = useState(false);

  const profileRef = useRef();
  const coverRef = useRef();
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  const { updateUser } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      if (field === "profileImage") setProfileImage(img);
      else setCoverImage(img);
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    if (field === "profileImage") setDraggingProfile(false);
    else setDraggingCover(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      let img = e.dataTransfer.files[0];
      if (field === "profileImage") setProfileImage(img);
      else setCoverImage(img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userData = { ...formData };
    let images = [];

    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      userData.profilePicture = fileName;
      images.push(data);
    }

    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append("name", fileName);
      data.append("file", coverImage);
      userData.coverPicture = fileName;
      images.push(data);
    }

    await updateUser(formData._id, userData, images);
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
      title={<b style={{ fontSize: "1.3rem" }}>Edit Profile</b>}
      centered
      radius="lg"
    >
      <form className="infoForm profileModalForm" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            className="infoInput"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname || ""}
            onChange={handleChange}
          />

          <input
            type="text"
            className="infoInput"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="worksAt"
            placeholder="Works at"
            value={formData.worksAt || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            className="infoInput"
            name="livesIn"
            placeholder="Lives in"
            value={formData.livesIn || ""}
            onChange={handleChange}
          />

          <input
            type="text"
            className="infoInput"
            name="country"
            placeholder="Country"
            value={formData.country || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="relationship"
            className="infoInput"
            placeholder="Relationship Status"
            value={formData.relationship || ""}
            onChange={handleChange}
          />
        </div>

        {/* Premium Drag and Drop Upload Boxes */}
        <div className="dropzoneContainer">
          {/* Profile Image Dropzone */}
          <div
            className={`dropzoneBox ${draggingProfile ? "dragging" : ""}`}
            onClick={() => profileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDraggingProfile(true); }}
            onDragLeave={() => setDraggingProfile(false)}
            onDrop={(e) => handleDrop(e, "profileImage")}
          >
            {profileImage ? (
              <>
                <img src={URL.createObjectURL(profileImage)} alt="profile preview" className="dropzonePreview" />
                <div className="dropzoneOverlay">
                  <UilCloudUpload size={30} />
                  <span>Click or Drop to Replace</span>
                </div>
              </>
            ) : formData.profilePicture ? (
              <>
                <img src={publicFolder + formData.profilePicture} alt="existing profile" className="dropzonePreview" />
                <div className="dropzoneOverlay">
                  <UilCloudUpload size={30} />
                  <span>Click or Drop to Replace</span>
                </div>
              </>
            ) : (
              <div className="dropzoneContent">
                <UilUserSquare size={36} className="dropzoneIcon" />
                <span><b>Profile Image</b></span>
                <span>Click or Drag & Drop</span>
              </div>
            )}
            <input type="file" ref={profileRef} style={{ display: "none" }} accept="image/*" onChange={(e) => onImageChange(e, "profileImage")} />
          </div>

          {/* Cover Image Dropzone */}
          <div
            className={`dropzoneBox ${draggingCover ? "dragging" : ""}`}
            onClick={() => coverRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDraggingCover(true); }}
            onDragLeave={() => setDraggingCover(false)}
            onDrop={(e) => handleDrop(e, "coverImage")}
          >
            {coverImage ? (
              <>
                <img src={URL.createObjectURL(coverImage)} alt="cover preview" className="dropzonePreview" />
                <div className="dropzoneOverlay">
                  <UilCloudUpload size={30} />
                  <span>Click or Drop to Replace</span>
                </div>
              </>
            ) : formData.coverPicture ? (
              <>
                <img src={publicFolder + formData.coverPicture} alt="existing cover" className="dropzonePreview" />
                <div className="dropzoneOverlay">
                  <UilCloudUpload size={30} />
                  <span>Click or Drop to Replace</span>
                </div>
              </>
            ) : (
              <div className="dropzoneContent">
                <UilScenery size={36} className="dropzoneIcon" />
                <span><b>Cover Image</b></span>
                <span>Click or Drag & Drop</span>
              </div>
            )}
            <input type="file" ref={coverRef} style={{ display: "none" }} accept="image/*" onChange={(e) => onImageChange(e, "coverImage")} />
          </div>
        </div>

        <button className="modalUpdateBtn" type="submit">
          Update Profile
        </button>
      </form>
    </Modal>
  );
}

export default ProfileModal;
