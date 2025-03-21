import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  //   try {
  //     const authHeader = req.headers.authorization;

  //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //       return res
  //         .status(401)
  //         .json({ message: "Unauthorized: No token provided" });
  //     }

  //     const token = req.header("Authorization".replace("Bearer ", ""));

  //     if (!token) {
  //       return res
  //         .status(401)
  //         .json({ message: "No authentication token , access denied" });
  //     }

  //     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //     const user = await UserModel.findById(decoded.userId).select("-password");
  //     if (!user) {
  //       return res.status(401).json({ message: "Token is not valid" });
  //     }
  //     req.user = user;
  //     next();
  //   } catch (error) {
  //     console.log("Error in protect route", error);
  //     res.status(401).json({ message: "Token is not valid" });
  //   }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Kullanıcı bilgisini request objesine ekleyelim
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default protectRoute;
