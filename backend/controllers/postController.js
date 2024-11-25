import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!img && !text) {
      return res.status(400).json({ message: "Text or image is required" });
    }
    const newPost = new Post({
      user: user,
      text,
      img,
    });
    await newPost.save();
    res.status(200).json({ message: "Post created successfully" });
    console.log(user, "user");
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const PostToDelete = await Post.findByIdAndDelete(id);

    if (!PostToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;

    const { id } = req.params;

    const userId = req.user._id;

    const PostToComment = await Post.findById(id);
    if (!PostToComment) {
      return res.status(404).json({ message: "Post not found" });
    }
    PostToComment.comments.push({ user: userId, text: text });
    await PostToComment.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const UserWhoLiked = await User.findById(userId);
    const PostToLike = await Post.findById(id);
    if (!PostToLike) {
      return res.status(404).json({ message: "Post not found" });
    }
    if(PostToLike.user.toString() === userId.toString()){
      return res.status(400).json({ message: "You cannot like your own post" });}
    if (PostToLike.likes.includes(userId)) {
      await PostToLike.updateOne({ $pull: { likes: userId } });
      await UserWhoLiked.updateOne({ $pull: { likedPosts: id } });

      
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      await PostToLike.updateOne({ $push: { likes: userId } });
      await UserWhoLiked.updateOne({ $push: { likedPosts: id } });

      const notification = new Notification({
        from: userId,
        to: PostToLike.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 }).populate({
      path: "user",
      select: "username fullName profileImg",
    })
    .populate({
      path: "comments.user",
      select: "username fullName profileImg ",
    });

    res.status(200).json(allPosts);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
    try {
        const {id} = req.params;
        
        const user = await User.findById(id);
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
            path:'user',
            select: 'username profileImg'
        }).populate({
            path:'comments.user',
            select: 'username profileImg'
        });

        res.status(200).json(likedPosts);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
}};

export const getFollowingPosts = async (req, res) => {
        try {
            console.log(req.user._id)
            const userId = req.user._id;
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const followingUsers = user.following;
            const followingPosts = await Post.find({user: {$in: followingUsers}}).populate({
              path:'user',
              select: 'username fullName profileImg'
          });
            res.status(200).json(followingPosts);
            
        } catch (error) {
            res.status(500).json({ error: error.message });  
        }
};

export const getUserPosts = async (req, res) => {
try {
    const {id} = req.params;
    
    
    const userPosts = await Post.find({user: id}).sort({createdAt: -1}).populate({
        path: "user",
        select: "username  profileImg fullName",
      })
      .populate({
        path: "comments.user",
        select: "fullName username  profileImg ",
      });

    res.status(200).json(userPosts);
    

} catch (error) {
    res.status(500).json({ error: error.message });
}}
