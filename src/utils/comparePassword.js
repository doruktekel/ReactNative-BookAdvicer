import bcrypt from "bcryptjs";

const comparePassword = async (pass, userPass) => {
  try {
    const verifyPass = await bcrypt.compare(pass, userPass);
    return verifyPass;
  } catch (error) {
    console.log("Password compare problem", error);
  }
};

export default comparePassword;
