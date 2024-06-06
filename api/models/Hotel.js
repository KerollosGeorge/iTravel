import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    HotelName: {
      type: String,
      required: true,
    },
    type: {
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
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 3,
    },
    //rooms ids
    rooms: {
      type: [String],
    },
    //review ids
    reviews: {
      type: [String],
    },
    cheapestPrice: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    unavailableDates: {
      type: [Date],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hotel", hotelSchema);
