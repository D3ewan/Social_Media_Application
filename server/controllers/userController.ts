// const Post = require("../models/Post");
// const User = require("../models/User");
// const { mapPostOutput } = require("../utils/mapPostOutput");
import { error, success } from "../utils/responseWrapper";
import Cloudinary from 'cloudinary';
const cloudinary=Cloudinary.v2;


const followOrUnfollowUserController = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const currentUserId = req._id;

        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(currentUserId);
        if (currentUserId === userIdToFollow) {
            return res.send(error(409, "Users cannot follow themselves"));
        }
        if (!userToFollow) {
            return res.send(error(404, 'User to follow not found'))
        }

        if (currentUser.followings.includes(userIdToFollow)) {
            const followingIndex = currentUser.followings.indexOf(userIdToFollow);
            currentUser.followings.splice(followingIndex, 1);

            const followerIndex = userToFollow.followers.indexOf(currentUserId);
            userToFollow.followers.splice(followerIndex, 1);
        }

        else {
            userToFollow.followers.push(currentUserId);
            currentUser.followings.push(userIdToFollow);

        }
        currentUser.save();
        userToFollow.save();
        return res.send(success(200, {user: userToFollow}))
    } catch (e) {
        return res.send(error(500, e.message))
    }

}

const getPostsOfFollowingController = async (req, res) => {
    try {
        const currentUserId = req._id;
        const currentUser = await User.findById(currentUserId).populate('followings');

        const fullPosts = await Post.find({
            owner: {
                $in: currentUser.followings
            }
        }).populate('owner');

        const posts = fullPosts.map(post => mapPostOutput(post, req._id)).reverse();
        const followingsIds = currentUser.followings.map(item => item._id);
        followingsIds.push(currentUserId);
        const suggestion = await User.find({
            _id: {
                $nin: followingsIds
            }
        })
        return res.send(success(200, {...currentUser._doc, suggestion, posts }))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const getMyPostController = async (req, res) => {
    try {
        const currentUserId = req._id;
        const allUserPosts = await Post.find({ owner: currentUserId }).populate('likes');

        return res.send(success(200, { allUserPosts }));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const getUserPostsController = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send(error(400, 'UserId is required'));
        }
        const allUserPosts = await Post.find({ owner: userId }).populate('likes');

        return res.send(success(200, { allUserPosts }));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

const deleteUserProfileController = async (req, res) => {
    try {
        const currentUserId = req._id;
        const currentUser = await User.findById(currentUserId);

        //delete all posts
        await Post.deleteMany({
            owner: currentUser
        })

        // removed myself from followers followings
        currentUser.followers.forEach(async (followerId) => {
            const follower = await User.findById(followerId);
            const index = follower.followings.indexOf(currentUser);
            follower.followings.splice(index, 1);
            await follower.save();
        });

        // remove myself from my followings followers
        currentUser.followings.forEach(async (followerId) => {
            const following = await User.findById(followerId);
            const index = following.followers.indexOf(currentUser);
            following.followers.splice(index, 1);
            await following.save();
        });

        //remove myself from all likes;
        const allPosts = await Post.find();
        allPosts.forEach(async post => {
            const index = post.likes.indexOf(currentUserId);
            post.likes.splice(index, 1);
            await post.save();
        })

        await currentUser.deleteOne();
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, 'user deleted'))
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getMyInfoController = async (req, res) => {
    try {
        const user = await User.findById(req._id);
        return res.send(success(200, { user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }

}
const updateUserProfileController = async (req, res) => {
    try {
        const { name, bio, userImg } = req.body;
        const user = await User.findById(req._id);

        if (name) {
            user.name = name;
        }
        if (bio) {
            user.bio = bio;
        }
        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: 'SocialMedia/profileImg'
            })

            user.avatar = {
                url: cloudImg.secure_url,
                publicId: cloudImg.public_id
            }
        }
        await user.save();
        return res.send(success(200, { user }))
    } catch (e) {
        return res.send(error(500, e.message));
    }
}
const getUserProfileController = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).populate({
            path: "posts",
            populate: { 
                path: "owner"
            }
        });
        const fullPosts = user.posts;
        const posts = fullPosts.map(post => mapPostOutput(post, req._id)).reverse();
        return res.send(success(200,{...user._doc, posts}))
    } catch (e) {
        return res.send(error(500, e.message));
    }

    
};

export {
    updateUserProfileController,
    getMyInfoController,
    getUserPostsController,
    getMyPostController,
    followOrUnfollowUserController,
    getPostsOfFollowingController,
    deleteUserProfileController,
    getUserProfileController
}