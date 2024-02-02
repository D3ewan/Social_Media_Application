// import Post = require("../models/Post")
// import User from "../models/User"
import { success, error } from "../utils/responseWrapper";
const cloudinary = require('cloudinary').v2;
// const { mapPostOutput } = require("../utils/mapPostOutput");

const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body;
        if (!caption || !postImg) return res.send(error(400, 'caption and postImg are required'));

        const cloudImg = await cloudinary.uploader.upload(postImg, {
            folder: "SocialMedia/postImage"
        })

        const owner = req._id;
        const user = await User.findById(owner);

        const post = await Post.create({
            owner, caption, image: {
                publicId: cloudImg.public_id,
                url: cloudImg.secure_url,
            }
        })
        user.posts.push(post._id);
        await user.save();

        return res.send(success(201, { post }))

    } catch (e) {
        return res.send(error(500, e.message))
    }

}

const likeAndUnlikePostController = async (req, res) => {
    try {
        const { postId } = req.body;
        const currentUserId = req._id;

        const post = await Post.findById(postId).populate('owner');
        if (!post) {
            return res.send(error(404, "post not found"))
        }
        if (post.likes.includes(currentUserId)) {
            const index = post.likes.indexOf(currentUserId);
            post.likes.splice(index, 1);
        }
        else {
            post.likes.push(currentUserId);
        }
        await post.save();
        return res.send(success(200, {post : mapPostOutput(post,currentUserId)}));
    } catch (e) {
        return res.send(error(500, e.message))
    }


}

const updatePostControlller = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const currentUserId = req._id;

        if (!caption) {
            return res.send(error(400, "caption is required"))
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.send(error(404, "post not found"))
        }

        if (post.owner.toString() !== currentUserId) {
            return res.send(error(403, "Only owner can update their post"));
        }

        if (caption) {
            post.caption = caption;
        }

        await post.save();
        return res.send(success(200, "Post Updated"))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const deletePostControlller = async (req, res) => {

    try {
        const { postId } = req.body;
        const currentUserId = req._id;

        const post = await Post.findById(postId);
        const currentUser = await User.findById(currentUserId);

        if (!post) {
            return res.send(error(404, "post not found"))
        }

        if (post.owner.toString() !== currentUserId) {
            return res.send(error(403, "Only owner can delete their post"));
        }

        const index = currentUser.posts.indexOf(postId)
        currentUser.posts.splice(index, 1);

        await currentUser.save();
        await post.deleteOne();

        return res.send(success(200, 'post deleted successfully'));

    } catch (e) {
        return res.send(error(500, e.message));
    }
}

export  {
    deletePostControlller,
    createPostController,
    likeAndUnlikePostController,
    updatePostControlller
}