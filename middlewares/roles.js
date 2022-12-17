const admin = (req, res, next) => {
  const user = req.user.roles;
  if (!user.roles.includes("admin")) {
    return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
  }
  next();
};

const user = (req, res, next) => {
  const user = req.user.roles;
  if (!user.roles.includes("user")) {
    return res.status(403).json({ message: "Bu işlem için yetkiniz yok." });
  }
  next();
};

export { admin, user };
