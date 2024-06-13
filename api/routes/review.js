import express from "express";
import { verifyUpdatedUser, verifyUser } from "../utils/verify_token.js";
import {
  AddReview,
  AddSiteReview,
  /*   DeleteSiteReview,
  DeleteHotelReview, */
  GetAllReviews,
  GetAllSiteReviews,
  UpdateReview,
  GetUserFromReviewID,
  GetReview,
  GetAllHotelsReviews,
  DeleteReview,
} from "../controllers/review.js";

const router = express.Router();

//Add hotel review
router.post("/:userId/:hotelId", verifyUser, AddReview);

//Add Site review
router.post("/:userId" /* , verifyUser */, AddSiteReview);

//list
router.get("/", GetAllReviews);

//get all hotels reviews
router.get("/hotel/:hotelId", GetAllHotelsReviews);

//get all site reviews
router.get("/site", GetAllSiteReviews);

//update review
router.put("/:userId/:reviewId", verifyUser, UpdateReview);

//delete

//delete review from user and site or hotels
router.delete("/:reviewId", DeleteReview);

/* router.delete(
  "/:userId/:hotelId/:reviewId",
  verifyUser, DeleteHotelReview
);

//delete site review
router.delete("/:userId/:reviewId", verifyUser,  DeleteSiteReview);
 */
//view

//get user from review id
// router.get("/:reviewId", GetUserFromReviewID);

router.get("/review/:reviewId", GetReview);

export default router;
