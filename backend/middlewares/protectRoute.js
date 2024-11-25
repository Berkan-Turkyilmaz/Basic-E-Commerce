import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


export const protectRoute = async (req, res, next) => {
  try {
    
		const token = req.cookies.jwt;
    
    
    

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
   

    if (!user) {
      return res.status(401).json({ message: "User not found", user });
    }
    req.user = user;
    next();

  } catch (error) {
    return res.status(500).json({ error: error.message, message: "Internal server error" });
  }
};
