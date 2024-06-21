import express from "express";
import {
  GetAllRooms,
  GetRoom,
  CreateRoom,
  UpdateRoom,
  UpdateRoomAvailability,
  DeleteRoom,
  DeleteSpecificRoom,
  GetHotelFromRoom,
} from "../controllers/room.js";
import { verifyAdmin } from "../utils/verify_token.js";
import { upload } from "../utils/uploadImages.js";

const router = express.Router();

//user Accessability

router.get("/", GetAllRooms);

router.get("/:id", GetRoom);

router.get("/findHotel/:id", GetHotelFromRoom);

router.put("/availability/:id", UpdateRoomAvailability);

//admin Accessability

router.post("/", upload, CreateRoom);

router.put("/:id", upload, UpdateRoom);

router.delete("/:hotelId/:roomId", DeleteRoom);
router.delete("/:roomId", DeleteSpecificRoom);

export default router;
