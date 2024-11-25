import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
try {
    const userId = req.user._id;
    const notifications = await Notification.find({to: userId}).populate({
        path: 'from',
        select: 'username fullName profileImg'
    }).populate({
        path: 'to',
        select: 'username fullName profileImg'
    });
    await Notification.updateMany({to: userId}, {read: true})
    res.status(200).json({notifications})
    
} catch (error) {
    res.status(500).json({error: error.message})
}
}


export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});
        res.status(200).json({message: "successfully deleted"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}