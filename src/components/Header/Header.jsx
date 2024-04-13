import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Header.css';
import { logout } from '../../actions/AuthAction.js';
import { useParams } from 'react-router-dom';
import { uploadImage } from "../../actions/UploadAction.js";
import { updateUser } from "../../actions/UserAction.js";

function Header() {
  const dispatch = useDispatch();
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);
  const param = useParams();

  // Extract password and store the rest in formData
  const { password, ...other } = user;
  const [formData, setFormData] = useState(other);

  const [profileImage, setProfileImage] = useState(null);
  const [isPopupVisible, setPopupVisibility] = useState(false);

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handleThreeDotsClick = () => {
    setPopupVisibility(!isPopupVisible);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      if(event.target.name === "profileImage") {

        setProfileImage(img);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let UserData = formData;
    console.log(formData)
  
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
  
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePicture = fileName;
  
      try {
        await dispatch(uploadImage(data));
        setPopupVisibility(false);
      } catch (error) {
        console.log(error);
      }
    }
  
    await dispatch(updateUser(param.id, UserData));
  

    setPopupVisibility(false);
  };
  

  return (
    <div className="top_bar">
      <div className="left">
        <div className="dp_img">
          <img
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : user.profilePicture
                  ? publicFolder + user.profilePicture
                  : publicFolder + 'defaultProfile.png'
            }
            alt="ProfileImage"
            className="followerImage main-img"
          />
        </div>
        <span>{formData?.firstname}</span>
      </div>
      <div className="right">
        <div className="contact_icon">
          <svg viewBox="0 0 24 24" width="24" height="24" className="">
            <path
              fill="#aebac1"
              d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
            ></path>
          </svg>
        </div>
        <div className="three_dots" onClick={handleThreeDotsClick}>
          <svg viewBox="0 0 24 24" width="24" height="24" className="">
            <path
              fill="#aebac1"
              d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
            ></path>
          </svg>
        </div>
        <div className="logout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22"
            width="22"
            viewBox="0 0 512 512"
            onClick={handleLogOut}
          >
            <path
              fill="#aebac1"
              d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
            ></path>
          </svg>
        </div>
      </div>
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={() => setPopupVisibility(false)}>
              &times;
            </span>
            <h3>Your Info</h3>
            <form>
              <div>
                <input
                  value={formData.firstname}
                  onChange={handleChange}
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  className="infoInput"
                />
                <input
                  value={formData.lastname}
                  onChange={handleChange}
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  className="infoInput"
                />
              </div>
              <div className='profile-pop-up'>
                <h4>Profile image</h4>
                <input
                  type="file"
                  name="profileImage"
                  className="infoInput"
                  onChange={onImageChange}
                />
              </div>
              <button className="button-update" type="submit" onClick={handleSubmit}>
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;