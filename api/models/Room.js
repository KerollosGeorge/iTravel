import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    photos: {
      type: [String],
      // required: true,
    },
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    maxPeople: {
      type: Number,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    roomNumbers: [{ number: String, unavailableDates: { type: [Date] } }], //each room has its number in hotel and has a booking date
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
