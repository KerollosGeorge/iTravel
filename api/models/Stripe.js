import mongoose from "mongoose";

const stripeSchema = new mongoose.Schema({
  //email of user
  email: {
    type: String,
    required: true,
    unique: true,
  },
  //user id ==> [Number] بدل
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cardNumber: {
    type: Number,
    required: true,
    min: 16,
    max: 16,
  },
  expiryDate: {
    month: { type: Number },
    year: { type: Number },
  },
  cvv: {
    type: Number,
    required: true,
    min: 3,
  },
});
export default mongoose.model("Stripe", stripeSchema);
