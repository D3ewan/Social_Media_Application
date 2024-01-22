import React, { useEffect, useState } from 'react'
import "./Follower.scss"
import Avatar from '../avatar/Avatar'
import { useDispatch, useSelector } from 'react-redux';
import { followAndUnfollowUser } from '../../redux/slices/feedSlice';

function Follower({user}) {
    const dispatch = useDispatch();
    const {feedData} = useSelector(state => state.feedReducer)
    const [isFollowing, setIsFollowing] = useState(false)
    useEffect(()=>{
        setIsFollowing(feedData.followings.find(item=> item._id === user._id))    
    },[feedData])
    function handleUserFollow(){
        dispatch(followAndUnfollowUser({
            userIdToFollow: user._id
        }))
    }
    return (
        <div className="Follower">
            <div className="userInfo">
                <Avatar id={user._id}  src={user?.avatar?.url}/>
                <h4 className="name">{user?.name}</h4>
            </div>
            <button onClick={handleUserFollow} className="follow-link">{isFollowing ? "Unfollow" : "Follow"}</button>
        </div>
    )
}

export default Follower