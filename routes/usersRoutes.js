import router from "./_imports.js";

import UsersSchema from "../models/UsersSchema.js";
import { admin /* user */ } from "../middlewares/roles.js";
import auth from "../middlewares/auth.js";

// Get Users for Search
router.get(
  "/",
  /* auth, user, */ async (req, res) => {
    try {
      const { search } = req.query;

      const queryMethods = { $regex: search, $options: "i" };
      const users = await UsersSchema.where({
        $or: [{ firstName: queryMethods }, { lastName: queryMethods }],
      }).select("firstName lastName jobTitle avatar sector");

      return res.status(200).json({ users });
    } catch (e) {
      console.log("Search kısmında hata oluştu.");
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// Get User by Id
router.get("/list/:id", auth, admin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UsersSchema.findById(id);

    return res.status(200).json({ user });
  } catch (e) {
    console.log("Get by id kısmında hata oluştu.");
    return res.status(500).json({ message: "Server error" });
  }
});

// Get Users
router.get("/list", auth, admin, async (req, res) => {
  try {
    const users = await UsersSchema.find();
    return res.status(200).json({ users });
  } catch (e) {
    console.log("Get users kısmında hata oluştu.");
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
