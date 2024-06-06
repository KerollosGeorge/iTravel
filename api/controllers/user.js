import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import Review from "../models/review.js";
import { CreateError } from "../utils/customError.js";

//search for all users in the system
export const GetAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

// count users in the system
export const GetAllUsersCount = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    res.status(StatusCodes.OK).json(usersCount);
  } catch (error) {
    next(error);
  }
};
//get a specific user
export const GetUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(CreateError(StatusCodes.NOT_FOUND, "User not found"));
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

//update info of a specifc user
export const UpdateUser = async (req, res, next) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    await updateUser.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: "Your Informations are Updated Successfully", updateUser });
  } catch (error) {
    if (error.code == 11000) {
      next(
        CreateError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error.keyValue.firstName
            ? `This Name ${error.keyValue.firstName} is already exist please use another Name`
            : error.keyValue.lastName
            ? `This Name ${error.keyValue.lastName} is already exist please use another Name`
            : `This Email ${error.keyValue.email} is already exist please use another Email`
        )
      );
    } else {
      next(error);
    }
  }
};

//delete a specific user
export const DeleteUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (user.isAdmin) {
      return next(
        CreateError(StatusCodes.FORBIDDEN, "You can't delete admins")
      );
    }
    await Promise.all(
      user.reviews.map((reviewId) => {
        return Review.findByIdAndDelete(reviewId);
      })
    );
    try {
      await User.findByIdAndDelete(userId);
      res.status(StatusCodes.OK).json("the User has been Deleted Successfully");
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//get user favorites
export const GetFavorites = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);

    res.status(StatusCodes.OK).json(user.favorates);
  } catch (error) {
    next(error);
  }
};
//add/remove to favorites
export const AddToFavorites = async (req, res, next) => {
  const userId = req.params.userId;
  const hotelId = req.params.hotelId;
  try {
    const user = await User.findById(userId);
    if (user.favorates.includes(hotelId)) {
      await User.findByIdAndUpdate(userId, {
        $pull: { favorates: hotelId },
      });
      await user.save();
      return res
        .status(StatusCodes.OK)
        .json({ msg: "removed from Favorites", user });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { favorates: hotelId },
      });
      await user.save();
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Added to Favorites", user });
    }
  } catch (error) {
    next(error);
  }
};
