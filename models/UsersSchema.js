import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    roles: {
      type: Array,
      default: ["user"],
    },
    sector: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("users", UserSchema);
