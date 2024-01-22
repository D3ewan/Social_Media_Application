import React, { useEffect, useState } from 'react'
import "./UpdateProfile.scss"
import dummyImg from "../../assets/userImg.png"
import { useDispatch, useSelector } from 'react-redux'
import { updateMyProfile } from '../../redux/slices/appConfigSlice'

function UpdateProfile() {
  const { myProfile } = useSelector(state => state.appConfigReducer)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    // Check if a file is selected
    if (file) {
      // Set up the event listener
      reader.onloadend = () => {
        // Set the image when the reader finishes loading
        setUserImg(reader.result);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e){
     e.preventDefault();
     dispatch(updateMyProfile({name,bio,userImg}))
  }
  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="image-container">
            <label htmlFor="inputImg" className='labelImg'>
              <img className='user-img' src={userImg || myProfile?.avatar?.url || dummyImg} alt="dummyImg" />
            </label>
            <input id='inputImg' type='file' accept='image/*' className='inputImg' onChange={handleImageChange} />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input value={name} type="text" placeholder='Your Name' onChange={e => setName(e.target.value)} />
            <input value={bio} type="text" placeholder='Your Bio' onChange={e => setBio(e.target.value)} />
            <input type="submit" className='submit' />
          </form>
          <div className="delete-button">Delete Account</div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProfile