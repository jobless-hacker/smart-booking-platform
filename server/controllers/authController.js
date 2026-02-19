const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const { signToken } = require("../utils/jwt");

async function adminLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    return res.json({ token });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  adminLogin
};
