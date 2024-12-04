import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password, fullName} = req.body;
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      
    });

    if (newUser) {
        
      generateTokenAndSetCookie(newUser._id, res);
      
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Failed to create user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "User logged out"});
    
    
  } catch (error) {
  
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {

         return res.status(404).json({message: "User not found"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");

        if (isPasswordCorrect) {
            
          const token = generateTokenAndSetCookie(user._id, res);
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg
                
            });
        } else {
            res.status(400).json({ message: "Wrong password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMe = async (req, res) => {
console.log(req.user._id, "user id in getMe")
  try {

    const foundUser = await User.findById(req.user._id).select("-password");
    res.status(200).json({user:foundUser});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}