import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
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
    role: {
      type: String,
      default: "user",
    },
    //review ids
    reviews: {
      type: [String],
    },
    //favorate hotels
    favorates: {
      type: [String],
    },
    hotels: [String],
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
