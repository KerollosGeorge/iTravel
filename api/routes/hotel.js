import express from "express";
import {
  GetAllHotels,
  GetHotel,
  CountByCity,
  CountByType,
  GetHotelRooms,
  CreateHotel,
  UpdateHotel,
  DeleteHotel,
  UpdateHotelAvailability,
  AdminGetAllHotels,
  DeleteAddedHotel,
} from "../controllers/hotel.js";
import { verifyAdmin } from "../utils/verify_token.js";
import { GetHotelReviews } from "../controllers/review.js";
import { upload } from "../utils/uploadImages.js";
const router = express.Router();

//user pages
router.get("/", GetAllHotels);
router.get("/all-hotels", AdminGetAllHotels);
router.get("/find/:id", GetHotel);
router.get("/countByCity", CountByCity);
router.get("/countByType", CountByType);
router.get("/reviews/:hotelId", GetHotelReviews);
router.get("/room/:id", GetHotelRooms);

//admin pages
router.post("/" /*, verifyAdmin, */, upload, CreateHotel);
router.put("/:id" /* , verifyAdmin */, upload, UpdateHotel);
router.put("/availability/:id", UpdateHotelAvailability);
router.delete("/:id", DeleteHotel);
router.delete("/:userId/:id", DeleteAddedHotel);

export default router;
