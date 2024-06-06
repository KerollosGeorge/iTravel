import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      unique: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    //review ids
    reviews: {
      type: [String],
    },
    //favorate hotels
    favorates: {
      type: [String],
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
