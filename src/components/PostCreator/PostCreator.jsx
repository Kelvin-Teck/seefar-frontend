import React, { useState, useRef } from "react";
import "./PostCreator.css";
import { UilScenery, UilPlayCircle, UilLocationPoint, UilSchedule, UilTimes } from "@iconscout/react-unicons";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import DefaultProfile from "../../img/profileImg.jpg";

const PostCreator = ({ onFinish }) => {
  const user = useAuthStore((state) => state.authData.user);
  const { uploading: loading, uploadPost } = usePostStore();
  const serverAssetsPublicFolder = import.meta.env.VITE_PUBLIC_FOLDER;

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [showScheduleInput, setShowScheduleInput] = useState(false);

  const imageRef = useRef();
  const videoRef = useRef();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
      setVideo(null); // Clear video if image selected
    }
  };

  const onVideoChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let vid = event.target.files[0];
      setVideo(vid);
      setImage(null); // Clear image if video selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc && !image && !video) return;

    const newPost = {
      userId: user._id,
      desc: desc,
    };
    if (location) newPost.location = location;
    if (scheduleDate) newPost.scheduleDate = new Date(scheduleDate).toISOString();

    let mediaData = null;
    if (image) {
      mediaData = new FormData();
      const filename = Date.now() + image.name;
      mediaData.append("name", filename);
      mediaData.append("file", image);
      newPost.image = filename;
    } else if (video) {
      mediaData = new FormData();
      const filename = Date.now() + video.name;
      mediaData.append("name", filename);
      mediaData.append("file", video);
      newPost.video = filename;
    }

    try {
      await uploadPost(newPost, mediaData);
      setDesc("");
      setImage(null);
      setVideo(null);
      setLocation("");
      setScheduleDate("");
      setShowLocationInput(false);
      setShowScheduleInput(false);
      if (onFinish) onFinish();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="PostCreator">
      <div className="creatorHeader">
        <img
          src={user.profilePicture ? serverAssetsPublicFolder + user.profilePicture : DefaultProfile}
          alt="Profile"
        />
        <div className="creatorInfo">
          <span>{user.firstname} {user.lastname}</span>
          <span>Post to Anyone</span>
        </div>
      </div>

      <div className="creatorBody">
        <textarea
          placeholder="What's on your mind?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={5}
        />
        
        {image && (
          <div className="previewContainer">
            <div className="removeImage" onClick={() => setImage(null)}>
              <UilTimes />
            </div>
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}

        {video && (
          <div className="previewContainer">
            <div className="removeImage" onClick={() => setVideo(null)}>
              <UilTimes />
            </div>
            <video src={URL.createObjectURL(video)} controls style={{ width: "100%", maxHeight: "25rem", objectFit: "cover" }} />
          </div>
        )}

        {showLocationInput && (
          <div className="extraInputContainer">
            <UilLocationPoint style={{ color: "var(--location)" }} />
            <input
              type="text"
              placeholder="Where are you?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoFocus
            />
            <UilTimes className="closeIcon" onClick={() => { setLocation(""); setShowLocationInput(false); }} />
          </div>
        )}

        {showScheduleInput && (
          <div className="extraInputContainer">
            <UilSchedule style={{ color: "var(--schedule)" }} />
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              autoFocus
            />
            <UilTimes className="closeIcon" onClick={() => { setScheduleDate(""); setShowScheduleInput(false); }} />
          </div>
        )}
      </div>

      <div className="creatorFooter">
        <div className="addResources">
          <div className="resourceOption" onClick={() => imageRef.current.click()} title="Add Photo">
            <UilScenery style={{ color: "var(--photo)" }} />
          </div>
          <div className="resourceOption" onClick={() => videoRef.current.click()} title="Add Video">
            <UilPlayCircle style={{ color: "var(--video)" }} />
          </div>
          <div className="resourceOption" onClick={() => setShowLocationInput(!showLocationInput)} title="Add Location">
            <UilLocationPoint style={{ color: "var(--location)" }} />
          </div>
          <div className="resourceOption" onClick={() => setShowScheduleInput(!showScheduleInput)} title="Schedule Post">
            <UilSchedule style={{ color: "var(--schedule)" }} />
          </div>
        </div>

        <button
          className="button postBtn"
          onClick={handleSubmit}
          disabled={loading || (!desc && !image && !video)}
        >
          {loading ? "Posting..." : "Post"}
        </button>

        <div style={{ display: "none" }}>
          <input type="file" accept="image/*" ref={imageRef} onChange={onImageChange} />
          <input type="file" accept="video/*" ref={videoRef} onChange={onVideoChange} />
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
