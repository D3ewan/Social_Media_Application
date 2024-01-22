import React from 'react'
import "./Avatar.scss"
import dummyImage from "../../assets/userImg.png"
import { useNavigate } from 'react-router-dom';
function Avatar({id, src}) {
    const navigate = useNavigate();
    return (
        <div onClick={()=>navigate(`/profile/${id}`)} className='profile-photo Avatar'>
            <img src={src || dummyImage} alt="dummyImg" />
        </div>

    )
}

export default Avatar