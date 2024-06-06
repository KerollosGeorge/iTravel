import { StatusCodes } from "http-status-codes";
import Hotel from "../models/Hotel.js";
import User from "../models/User.js";
import Review from "../models/review.js";
import { CreateError } from "../utils/customError.js";

//Add Review for a specific hotel ==> Create
export const AddReview = async (req, res, next) => {
  const userId = req.params.userId;
  const hotelId = req.params.hotelId;
  const newReview = new Review({ type: "hotel", ...req.body });
  try {
    const savedReview = await newReview.save();
    //Assign the review to a specific User and Hotel
    await User.findByIdAndUpdate(userId, {
      $push: { reviews: savedReview._id },
    });
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { reviews: savedReview._id },
    });
    res.status(StatusCodes.CREATED).json({ msg: "Success", savedReview });
  } catch (error) {
    next(error);
  }
};

//Site Review
export const AddSiteReview = async (req, res, next) => {
  const userId = req.params.userId;
  const newReview = new Review({ type: "site", ...req.body });
  try {
    const savedReview = await newReview.save();
    //Assign the review to a specific User and Hotel
    await User.findByIdAndUpdate(userId, {
      $push: { reviews: savedReview._id },
    });
    res.status(StatusCodes.CREATED).json({ msg: "Success", savedReview });
  } catch (error) {
    next(error);
  }
};
//get all reviews
export const GetAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    if (!reviews) return next(CreateError("No Reviews Found"));
    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error);
  }
};

//get all hotels reviews
export const GetAllHotelsReviews = async (req, res, next) => {
  const limit = req.query.limit;
  try {
    const reviews = await Review.find({ type: "hotel" })
      .sort("-updatedAt")
      .limit(limit);
    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error);
  }
};
//get all Site reviews
export const GetAllSiteReviews = async (req, res, next) => {
  const limit = req.query.limit;
  try {
    const reviews = await Review.find({ type: "site" })
      .sort("-updatedAt")
      .limit(limit);
    res.status(StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error);
  }
};

//update review
export const UpdateReview = async (req, res, next) => {
  const userId = req.params.userId;
  const reviewId = req.params.reviewId;
  try {
    const user = await User.findById(userId);
    if (user.reviews.includes(reviewId)) {
      try {
        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          { $set: req.body },
          { new: true }
        );
        res.status(StatusCodes.OK).json({
          msg: "your Review is updated successfully",
          newReview: { updatedReview },
        });
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
};

/* //delte review and pull its id from user and hotel
export const DeleteHotelReview = async (req, res, next) => {
  const userId = req.params.userId;
  const hotelId = req.params.hotelId;
  const reviewId = req.params.reviewId;

  try {
    const user = await User.findById(userId);
    const hotel = await Hotel.findById(hotelId);

    if (user.reviews.includes(reviewId) && hotel.reviews.includes(reviewId)) {
      await Review.findByIdAndDelete(reviewId);
      try {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { reviews: reviewId } },
          { new: true }
        );
        await Hotel.findByIdAndUpdate(
          hotelId,
          { $pull: { reviews: reviewId } },
          { new: true }
        );
      } catch (error) {
        next(error);
      }
    } else {
      return res
        .status(401)
        .json("You are not authorized to perform this action");
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "the Review has been deleted successfully" });
  } catch (error) {
    next(error);
  }
};
//delte review and pull its id from user and hotel
export const DeleteSiteReview = async (req, res, next) => {
  const userId = req.params.userId;
  const reviewId = req.params.reviewId;

  try {
    const user = await User.findById(userId);
    //عايز اتاكد الاول ان اليوزر عنده التعليق
    if (user.reviews.includes(reviewId)) {
      await Review.findByIdAndDelete(reviewId);
      try {
        await User.findByIdAndUpdate(
          userId,
          { $pull: { reviews: reviewId } },
          { new: true }
        );
      } catch (error) {
        next(error);
      }
    } else {
      return res.status(401).send({
        auth: false,
        message: "You don't have permission to perform this action.",
      });
    }
    res
      .status(StatusCodes.OK)
      .json({ msg: "the Review has been deleted successfully" });
  } catch (error) {
    next(error);
  }
}; */
//delete
export const DeleteReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return next(
        CreateError(StatusCodes.NOT_FOUND, "There is no such Review!")
      );
    }
    try {
      const users = await User.find({ reviews: { $in: [reviewId] } });
      if (!users || users.length === 0) {
        return next(
          CreateError(StatusCodes.NOT_FOUND, "No such review " + reviewId)
        );
      } else {
        Promise.all(
          users.map((user) => {
            if (user.reviews.includes(reviewId)) {
              user.reviews = user.reviews.filter((id) => id != reviewId);
            }
            return user.save();
          })
        );
        try {
          const hotels = await Hotel.find({ reviews: { $in: [reviewId] } });
          if (hotels) {
            Promise.all(
              hotels.map((hotel) => {
                if (hotel.reviews.includes(reviewId)) {
                  hotel.reviews = hotel.reviews.filter((id) => id != reviewId);
                }
                return hotel.save();
              })
            ).then(() => {
              res
                .status(StatusCodes.OK)
                .json("Room has been Deleted Successfully");
            });
          }
        } catch (error) {
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//get user Reviews
export const GetUserReviews = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const userReviewsList = await Promise.all(
      user.reviews.map((id) =>
        Review.find({ _id: id, type: "hotel" }).sort("updatedAt")
      )
    );
    let hotelReviews = [];
    for (let i = 0; i < userReviewsList.length; i++) {
      if (userReviewsList[i].length !== 0) {
        hotelReviews = [...hotelReviews, ...userReviewsList[i]];
      }
    }
    res.status(StatusCodes.OK).json(hotelReviews);
  } catch (error) {
    next(error);
  }
};

//get user's Reviews of Site
export const GetSiteReviews = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    const userReviewsList = await Promise.all(
      user.reviews.map((id) =>
        Review.find({ _id: id, type: "site" }).sort("updatedAt")
      )
    );
    let siteReviews = [];
    for (let i = 0; i < userReviewsList.length; i++) {
      if (userReviewsList[i].length !== 0) {
        siteReviews = [...siteReviews, ...userReviewsList[i]];
      }
    }
    res.status(StatusCodes.OK).json(siteReviews);
  } catch (error) {
    next(error);
  }
};

//get hotel Reviews
export const GetHotelReviews = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  try {
    const hotel = await Hotel.findById(hotelId);
    const hotelReviewsList = await Promise.all(
      hotel.reviews.map((id) => Review.findById(id))
    );
    res.status(StatusCodes.OK).json(hotelReviewsList);
  } catch (error) {
    next(error);
  }
};

//get user from reveiewId
export const GetUserFromReviewID = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  try {
    const user = await User.findOne({ reviews: reviewId });
    if (!user) return res.status(StatusCodes.NOT_FOUND).json("No user found");
    res.status(StatusCodes.OK).json(user);
  } catch (err) {
    next(err);
  }
};
//get a specifi review
export const GetReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    try {
      const user = await User.findOne({ reviews: { $in: [reviewId] } });
      if (!user) {
        return next(CreateError(StatusCodes.NOT_FOUND, "Review not found"));
      } else {
        try {
          const hotel = await Hotel.findOne({ reviews: { $in: [reviewId] } });
          //add the user and hotel to the review object
          if (hotel) {
            return res
              .status(StatusCodes.OK)
              .json({ review: review, user: user, hotel: hotel });
          } else {
            return res
              .status(StatusCodes.OK)
              .json({ review: review, user: user });
          }
        } catch (error) {
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

/*
export const GetReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;
  try {
    const review = await Review.findById(reviewId);
    try {
      const user = await User.find({ reviews: { $in: [reviewId] } });
      if (!user) {
        return next(CreateError(StatusCodes.NOT_FOUND, "Review not found"));
      } else {
        try {
          const hotel = await Hotel.find({ reviews: { $in: [reviewId] } });
          if (hotel) {
            res
              .status(StatusCodes.OK)
              .json({ review: review, user: user, hotel: hotel });
          } else {
            res.status(StatusCodes.OK).json({ review: review, user: user });
          }
        } catch (error) {
          next(error);
        }
      }
    } catch (error) {
      next(error);
    }
  } catch (err) {
    next(err);
  }
}; */
