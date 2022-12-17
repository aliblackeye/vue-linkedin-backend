import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default (req, res, next) => {
  try {
    const token = req.headers["Authorization"].split(" ")[1];
    if (!token) return res.status(401).json({ message: "Yetkilendirilemedi." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Yetkilendirilemedi." });
  }
};
