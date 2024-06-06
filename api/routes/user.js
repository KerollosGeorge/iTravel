import express from "express";
import {
  GetAllUsers,
  GetUser,
  UpdateUser,
  DeleteUser,
  AddToFavorites,
  GetFavorites,
  GetAllUsersCount,
} from "../controllers/user.js";
import {
  verifyToken,
  verifyUser,
  verifyAdmin,
  verifyUpdatedUser,
} from "../utils/verify_token.js";
import { GetSiteReviews, GetUserReviews } from "../controllers/review.js";

const router = express.Router();

//for checking authentication
router.get("/checkauth", verifyToken, (req, res, next) => {
  res.send("hello user you have a token to access the routes");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("hello user you are logged in successfully");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("hello admin");
});

//only admin can get all users
router.get("/", GetAllUsers);

//get users count
router.get("/usersCount", GetAllUsersCount);

router.get("/:id", /* verifyUser, */ GetUser);

//get user's hotel reviews
router.get("/reviews/:userId", verifyUser, GetUserReviews);

//get use's site reviews
router.get("/site/reviews/:userId", GetSiteReviews);

router.put("/:id", UpdateUser);

router.delete("/:id", DeleteUser);

//Favorites
router.put("/favorite/:userId/:hotelId", AddToFavorites);

router.get("/favorite/:userId", GetFavorites);

/* router.delete("/favorite/:userId/:hotelId", DeleteFavorite); */

export default router;
