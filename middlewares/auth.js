import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async (req, res, next) => {
  try {
    let token = await req.headers["Authorization"].split(" ")[1];
    if (!token) return res.status(403).json({ message: "Erişim reddedildi!" });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Yetkilendirilemedi." });
  }
};
