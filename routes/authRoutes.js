import router from "./_imports.js";
import UsersSchema from "../models/UsersSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
/* import auth from "../middlewares/auth.js"; */
dotenv.config();

const createToken = (user, secret, expiresIn) => {
  return jwt.sign(
    { id: user._id, roles: user.roles },
    secret,
    expiresIn ? { expiresIn: expiresIn } : {}
  );
};

// Login
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    const user = await UsersSchema.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (user) {
      const hashedPassword = user.password;
      const comparedPassword = await bcrypt.compare(password, hashedPassword);

      if (!comparedPassword) {
        console.log("Şifre yanlış!");
        return res.status(401).json({
          success: false,
          message: "Kullanıcı adı veya şifre yanlış.",
        });
      }
      const accessToken = createToken(user, process.env.JWT_SECRET, "15m");

      req.headers["Authorization"] = `Bearer ${accessToken}`;
      const refreshToken = createToken(user, process.env.JWT_REFRESH_SECRET);

      await user.updateOne({ refreshToken: refreshToken });

      return res.status(200).json({
        success: true,
        message: "Giriş başarılı.",

        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          jobTitle: user.jobTitle,
          avatar: user.avatar,
          refreshToken,
          accessToken,
        },
      });
    }

    console.log("Kullanıcı bulunamadı.");
    return res
      .status(401)
      .json({ success: false, message: "Kullanıcı adı veya şifre yanlış." });
  } catch (e) {
    console.log("Login kısmında hata oluştu.");
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

//Register
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      jobTitle,
      avatar,
      sector,
    } = req.body;

    if (await UsersSchema.findOne({ email })) {
      return res.status(400).json({
        status: "false",
        isEmailRegistered: true,
        isPhoneRegistered: false,
        message: "Bu e-posta adresi zaten kullanılıyor.",
      });
    }

    if (!(await UsersSchema.findOne({ email }))) {
      if (await UsersSchema.findOne({ phone })) {
        return res.status(400).json({
          status: "false",
          isEmailRegistered: false,
          isPhoneRegistered: true,
          message: "Bu telefon numarası zaten kullanılıyor.",
        });
      }
      const rounds = 10;
      const hash = await bcrypt.hash(password, rounds);
      const newUser = new UsersSchema({
        firstName,
        lastName,
        email,
        password: hash,
        jobTitle,
        phone,
        avatar,
        sector,
      });

      newUser.save((e) => {
        if (e) {
          console.log("Kullanıcı kayıt edilemedi.");
          return res
            .status(500)
            .json({ success: false, message: "Server error" });
        }
        return res
          .status(200)
          .json({ success: false, message: "Kayıt başarılı." });
      });

      if (!hash) {
        console.log("Hash oluşturulamadı.");
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;

    const user = await UsersSchema.findOne({ refreshToken: token });

    if (user) {
      const isVerified = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      if (!isVerified) {
        return res
          .status(401)
          .json({ success: false, message: "Yenileme tokeni doğrulanamadı." });
      }

      const newAccessToken = createToken(user, process.env.JWT_SECRET, "15m");

      req.headers["Authorization"] = `Bearer ${newAccessToken}`;

      const newRefreshToken = createToken(user, process.env.JWT_REFRESH_SECRET);

      await user.updateOne({ refreshToken: newRefreshToken });

      return res.status(200).json({
        success: true,
        message: "Yenileme başarılı",
        user: {
          newAccessToken,
          newRefreshToken,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          jobTitle: user.jobTitle,
          avatar: user.avatar,
        },
      });
    }
    return res.status(401).json({ success: false, message: "İzniniz yok." });
  } catch (error) {
    console.log("Refresh token kısmında hata oluştu.");
    return res.status(500).json({ success: false, message: "Bir hata oluştu" });
  }
});

router.post("/logout", async (req, res) => {
  const { token } = req.body;
  const user = await UsersSchema.findOne({ refreshToken: token });
  if (!user) {
    return res.status(401).json({ success: false, message: "İzniniz yok." });
  }
  console.log("Çıkış başarılı.");
  await user.updateOne({ refreshToken: "" });
  return res.status(200).json({ success: true, message: "Çıkış başarılı." });
});

export default router;
