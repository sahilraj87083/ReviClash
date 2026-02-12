import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.utils.js";

const createPost = async ({
    userId,
    textContent ='',
    images,
    videos,
    visibility

}) => {
    const post = await Post.create({
        authorId : userId,
        textContent,
        images,
        videos,
        visibility
    })

    return post
}

const deletePost = async ( {
    userId,
    postId
}) => {

}


export {
    createPost,
    deletePost
}