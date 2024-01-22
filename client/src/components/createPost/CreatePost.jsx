import React, { useState } from 'react'
import "./CreatePost.scss"
import Avatar from '../avatar/Avatar'
import dummyImg from "../../assets/dummyImg.png"
import { BsCardImage } from "react-icons/bs"
import { axiosClient } from '../../utils/axiosClient'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/slices/postSlice'
import { useParams } from 'react-router-dom'
function CreatePost({isVisible}) {
    const [postImg, setPostImg] = useState('');
    const [caption, setCaption] = useState("");
    const { myProfile } = useSelector(state => state.appConfigReducer)
    const dispatch = useDispatch();
    const params = useParams();

    function handleImageChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.onloadend = () => {
                setPostImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handlePostSubmit = async() => {
        try {
            const result = await axiosClient.post('/posts', {
                caption, postImg
            })
            dispatch(getUserProfile({userId: myProfile._id}))
        } catch (error) {
            
        } finally {
            setCaption('');
            setPostImg(null);
            isVisible();
        }

    }
    return (
        <div className={`CreatePost`}>
            <div className="left">
                <Avatar id={params.userId} src={myProfile?.avatar?.url}/>
            </div>
            <div className="right">
                <input value={caption} type="text" className='captionInput' onChange={(e)=>setCaption(e.target.value)} />
                {postImg &&
                    <div className="img-container">
                        <img className='post-img' src={postImg} alt=' ' />
                    </div>
                }
                <div className="bottom">
                    <div className="input-post-img">
                        <label htmlFor="inputImg" className='labelImg'>
                            <BsCardImage />
                        </label>
                        <input id='inputImg' type='file' accept='image/*' className='inputImg' onChange={handleImageChange} />
                    </div>
                    <div className="button">
                        <button onClick={handlePostSubmit}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost