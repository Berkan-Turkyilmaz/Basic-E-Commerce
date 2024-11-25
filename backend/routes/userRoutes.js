import express from 'express';
import { followUnfollowUser, getSuggestedUsers, getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

export const userRoutes = express.Router();

userRoutes.get("/profile/:username",  getUserProfile)
userRoutes.get("/suggested", protectRoute, getSuggestedUsers)
userRoutes.post("/follow/:id",protectRoute,  followUnfollowUser)
userRoutes.post("/update",protectRoute,  updateUserProfile)



export default userRoutes;