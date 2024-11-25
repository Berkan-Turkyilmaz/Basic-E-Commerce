import express from 'express';
import { getMe, login, logout, signup } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const authRoutes = express.Router();

authRoutes.post('/signup', signup  )
authRoutes.post('/login', login  )
authRoutes.post('/logout', logout )
authRoutes.get('/me',protectRoute  , getMe )



export default authRoutes;