import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "req params id taken");
    const userToFollow = await User.findById(id);
    console.log(userToFollow, "userToFollow FOUND");
    const currentUser = await User.findById(req.user._id);
    console.log(currentUser, "currentUser FOUND");

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = userToFollow.followers.includes(req.user._id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      
      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      await newNotification.save();

      res.status(200).json({ message: "Followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(currentPassword,user.password);
      if (!isPasswordCorrect) {
       return res.status(400).json({ message: "Wrong password" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    } else {
      return res.status(400).json({ message: "Current and new password are required" });
    }
  

    user.fullName = fullName || user.fullName;
    user.email = email || user.email; 
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    await user.save();
    user.password = null
    res.status(200).json({ message: "Profile updated successfully", updatedUser: user });
   
  } catch (error) {
    res.status(500).json({ error: error.message, message: "Failed to update profile server side" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const randomUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);
    console.log(randomUsers, "randomUsers");
    const usersFollowed = await User.findById(userId).select("following");
    console.log(usersFollowed, "usersFollowed");

    const filteredUsers = randomUsers.filter(
      (user) => !usersFollowed.following.includes(user._id)
    );
    console.log(filteredUsers, "filteredUsers");
    filteredUsers.forEach((user) => {
      user.password = null;
    });

    res.status(200).json(filteredUsers);
  } catch (error) {}
};

