import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/postController.js';

const postRoutes = express.Router();


postRoutes.post("/create",protectRoute, createPost);
postRoutes.delete("/:id",protectRoute, deletePost);
postRoutes.post("/comment/:id",protectRoute, commentOnPost);
postRoutes.post("/likes/:id",protectRoute, likeUnlikePost );
postRoutes.get("",protectRoute, getAllPosts);
postRoutes.get("/likes/:id",protectRoute, getLikedPosts);
postRoutes.get("/following",protectRoute, getFollowingPosts);
postRoutes.get("/:id",protectRoute, getUserPosts);





export default postRoutes;