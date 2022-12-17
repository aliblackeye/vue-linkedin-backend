import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";

//express ile http server oluşturmak için
import express from "express";

//env dosyalarından hassas verileri almak için
import * as dotenv from "dotenv";
//MongoDB'ye bağlanmak için
import mongoose from "mongoose";
import cors from "cors";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);

//Database'e bağlanmak için bir fonksiyon oluşturuldu
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB'ye bağlandı.");
  } catch (error) {
    console.log(`Bağlantı başarısız: ${error}`);
  }
};

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı.`);
  connectDB();
});
