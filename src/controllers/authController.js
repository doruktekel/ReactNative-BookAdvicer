import UserModel from "../models/userModel.js";
import comparePassword from "../utils/comparePassword.js";
import generateToken from "../utils/generateToken.js";
import hashPassword from "../utils/hashPassword.js";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required !" });
    }

    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username should be at least min 4 characters !" });
    }

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email.trim())) {
      return res.status(400).json({ message: "Invalid Email type" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least min 6 characters !" });
    }

    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exist !" });
    }

    const profileImage = "https://avatar.iran.liara.run/public";

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      email,
      username,
      password: hashedPassword,
      profileImage,
    });

    const token = generateToken(user._id);

    const { password: _, ...rest } = user._doc;

    res.status(201).json({
      token,
      user: rest,
    });
  } catch (error) {
    console.log("Error in register controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required !" });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credentials are wrong !" });
    }

    const verifyPass = await comparePassword(password, user.password);

    if (!verifyPass) {
      return res.status(400).json({ message: "Credentials are wrong !" });
    }

    const token = generateToken(user._id);

    const { password: _, ...rest } = user._doc;

    res.status(200).json({
      token,
      user: rest,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login };
