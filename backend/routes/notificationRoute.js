import express from 'express';
import { deleteNotification, getNotifications } from '../controllers/notificationController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const notificationRoute = express.Router();


notificationRoute.get("/",protectRoute, getNotifications)
notificationRoute.delete("/",protectRoute, deleteNotification)


export default notificationRoute;