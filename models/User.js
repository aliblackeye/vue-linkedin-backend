import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      max: 50,
    },
    phone: {
      type: String,
      unique: true,
      required: false,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      default: "",
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
    connections: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model("users", UserSchema);
