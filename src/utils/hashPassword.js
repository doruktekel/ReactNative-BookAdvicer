import bcrypt from "bcryptjs";

const hashPassword = async (pass) => {
  try {
    const hashedPassword = await bcrypt.hash(pass, 12);
    return hashedPassword;
  } catch (error) {
    console.log("Password hash problem", error);
  }
};

export default hashPassword;
