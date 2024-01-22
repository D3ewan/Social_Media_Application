import React, { useEffect } from 'react'
import Post from '../post/Post'
import "./Feed.scss"
import Follower from '../follower/Follower'
import { useDispatch, useSelector } from 'react-redux'
import { getFeedData } from '../../redux/slices/feedSlice'

function Feed() {
    const dispatch = useDispatch();
    const {feedData} = useSelector(state => state.feedReducer)
    useEffect(()=>{
        dispatch(getFeedData());
    },[dispatch])
    return (
        <div className="Feed">
            <div className="container">
                <div className="left-part">
                    {feedData?.posts?.map(post => <Post key={post._id} post={post}/>)}
                </div>
                <div className="right-part">
                    <div className="following">
                        {feedData?.followings?.map(user => <Follower key={user._id} user={user}/>)}
                    </div>
                    <div className="following">
                    {feedData?.suggestion?.map(user => <Follower key={user._id} user={user}/>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed