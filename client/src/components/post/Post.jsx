import React from 'react'
import "./Post.scss"
import Avatar from '../avatar/Avatar'
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import { useDispatch } from 'react-redux'
import { likeAndUnlikePost } from '../../redux/slices/postSlice'

function Post({post}) {
    
    const dispatch = useDispatch();
    async function handlePostLiked(){
        dispatch(likeAndUnlikePost({
            postId: post._id
        }))
    }
  return (
    <div className="Post">
        <div className="heading">
            <Avatar id={post.owner._id} src={post?.owner?.avatar?.url}/>
            <h3>{post?.owner?.name}</h3>
        </div>
        <div className="content">
            <img src={post?.image?.url} alt="dummyImg" />
        </div>
        <div className="footer">
            <div className="like" onClick={handlePostLiked}>
                {post?.isLiked && <AiFillHeart style={{cursor: 'pointer'}} />}
                {!post?.isLiked && <AiOutlineHeart style={{cursor: 'pointer'}} />}
                <h3>{post?.likesCount} likes</h3>
            </div>
            <p className='caption'>{post?.caption}</p>
            <h6 className='time-ago'>{post?.timeAgo}</h6>
        </div>
    </div>
  )
}

export default Post