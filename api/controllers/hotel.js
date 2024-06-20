import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import Review from "../models/Review.js";
import path from "path";
import fs from "fs";
// 1) user accessability:

//get hotels in terms of their destination and min , max

//***************************not for admin*******************************//
export const GetAllHotels = async (req, res, next) => {
  const { limit, min, max, ...others } = req.query;
  let date = new Date();
  let formattedDate = date.toISOString().split("T")[0] + "T22:00:00.000+00:00";
  try {
    const AllHotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gte: min || 1, $lte: max || 10000000 },
      // unavailableDates: [],
    }).limit(limit);

    const hotels = await Promise.all(
      AllHotels.map(async (hotel) => {
        if (hotel.unavailableDates && hotel.unavailableDates.length > 1) {
          const endDate = new Date(hotel.unavailableDates[1]);
          endDate.setDate(endDate.getDate() + 1); // add one day to endDate
          if (endDate.getTime() <= new Date(formattedDate).getTime()) {
            hotel.unavailableDates = [];
            await hotel.save();
          }
        }
        return hotel;
      })
    );

    res.status(StatusCodes.OK).json(hotels);
  } catch (error) {
    next(error);
  }
};

//get all hotels for admin
export const AdminGetAllHotels = async (req, res, next) => {
  const hotels = await Hotel.find();
  res.status(StatusCodes.OK).json(hotels);
};

//get a specific hotel
export const GetHotel = async (req, res, next) => {
  const date = new Date();
  const formattedDate =
    date.toISOString().split("T")[0] + "T22:00:00.000+00:00";

  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel.unavailableDates?.length > 0) {
      const endDate = new Date(hotel.unavailableDates[1]);
      endDate.setDate(endDate.getDate() + 1); // add one day to endDate

      if (endDate.getTime() <= new Date(formattedDate).getTime()) {
        hotel.unavailableDates = [];
        await hotel.save();
      }
    }
    res.status(StatusCodes.OK).json(hotel);
  } catch (error) {
    next(error);
  }
};

//get the count of all hotels in each city
export const CountByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city }); //much faster than linear search used in find method
      })
    );
    res.status(StatusCodes.OK).json({ list });
  } catch (error) {
    next(error);
  }
};

//get the count of all hotels in each city
export const CountByType = async (req, res, next) => {
  try {
    const hotelsNumber = await Hotel.countDocuments({ type: "Hotel" });
    const appartmentsNumber = await Hotel.countDocuments({
      type: "Apartment",
    });
    const resortsNumber = await Hotel.countDocuments({ type: "Resort" });
    const villasNumber = await Hotel.countDocuments({ type: "Villa" });
    const cabinsNumber = await Hotel.countDocuments({ type: "Cabin" });
    res.status(StatusCodes.OK).json([
      { type: "Hotel", count: hotelsNumber },
      { type: "Apartment", count: appartmentsNumber },
      { type: "Resort", count: resortsNumber },
      { type: "Villa", count: villasNumber },
      { type: "Cabin", count: cabinsNumber },
    ]);
  } catch (error) {
    next(error);
  }
};

//get all rooms of a specific hotle
export const GetHotelRooms = async (req, res, next) => {
  const max = req.query.max;
  const roomNumbers = req.query.roomNumbers;
  const date = new Date();
  const formattedDate =
    date.toISOString().split("T")[0] + "T22:00:00.000+00:00";

  try {
    const hotel = await Hotel.findById(req.params.id);
    const rooms = await Promise.all(
      hotel.rooms.map((roomId) => Room.findById(roomId))
    );

    if (max > 0) {
      const filteredRooms = rooms.filter((room) => room.maxPeople >= max);
      await Promise.all(
        filteredRooms.map(async (room) => {
          room.roomNumbers.forEach(async (roomNumber) => {
            if (roomNumber.unavailableDates?.length > 0) {
              const endDate = new Date(roomNumber.unavailableDates[1]);
              endDate.setDate(endDate.getDate() + 1); // add one day to endDate

              if (endDate.getTime() <= new Date(formattedDate).getTime()) {
                await Room.updateOne(
                  { _id: room._id, "roomNumbers._id": roomNumber._id },
                  { $set: { "roomNumbers.$.unavailableDates": [] } }
                );
              }
            }
          });
        })
      );
      const sortedRooms = filteredRooms
        .filter((room) => {
          const unavailableDatesCount = room.roomNumbers.reduce(
            (acc, roomNumber) => {
              return acc + (roomNumber?.unavailableDates?.length === 0 ? 1 : 0);
            },
            0
          );
          return unavailableDatesCount >= roomNumbers;
        })
        .sort((a, b) => a.maxPeople - b.maxPeople);

      return res.status(StatusCodes.OK).json({ msg: "first", sortedRooms });
    } else {
      const filteredRooms = rooms.filter((room) => {
        const unavailableDatesCount = room.roomNumbers.reduce(
          (acc, roomNumber) => {
            return acc + (roomNumber?.unavailableDates?.length === 0 ? 1 : 0);
          },
          0
        );
        return unavailableDatesCount >= 1;
      });

      return res.status(StatusCodes.OK).json(filteredRooms);
    }
  } catch (error) {
    next(error);
  }
};
//2) admin accessability:
//create new hotel
export const CreateHotel = async (req, res, next) => {
  const { files, body } = req;
  const { urlImages } = body;
  let photos = [];

  // handle files
  if (files && files.length > 0) {
    photos = files.map((file) => file.filename);
  }

  // handle urls
  if (urlImages) {
    const Images = urlImages.split(",");
    photos = [...photos, ...Images];
  }

  const newHotel = new Hotel({
    photos,
    ...req.body,
  });

  try {
    const savedHotel = await newHotel.save();
    if (body.userId) {
      await User.findByIdAndUpdate(body.userId, {
        $push: { hotels: savedHotel._id },
      });
    }
    res
      .status(StatusCodes.CREATED)
      .json({ savedHotel, msg: "Hotel has been Created successfully" });
  } catch (error) {
    next(error);
  }
};
//update info of a specifc hotel
export const UpdateHotel = async (req, res, next) => {
  const { files, body } = req;
  const { urlImages } = body;
  let photos = [];

  // handle files
  if (files && files.length > 0) {
    photos = files.map((file) => file.filename);
  }

  // handle urls
  if (urlImages) {
    const Images = urlImages.split(",");
    photos = [...photos, ...Images];
  }
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel.photos && hotel.photos.length > 0) {
      hotel.photos.forEach((image) => {
        if (image.startsWith("http")) {
          return hotel.photos.filter((photo) => photo !== image);
        } else {
          const imagePath = path.join("./public/Images", image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              next(err);
            }
          });
        }
      });
    }
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        { $set: { photos }, ...req.body },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ updatedHotel, msg: "Hotel has been Updated successfully" });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const UpdateHotelAvailability = async (req, res, next) => {
  try {
    const startDate = new Date(req.body.date[0].startDate);
    const endDate = new Date(req.body.date[0].endDate);
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: { unavailableDates: [startDate, endDate] },
      },
      { new: true }
    );
    res
      .status(StatusCodes.OK)
      .json({ Msg: "Hotel status has been updated.", hotel });
  } catch (error) {
    next(error);
  }
};

//delete a specific hotel
// make the deletion of hotel and its rooms and its reviews is cascaded
export const DeleteHotel = async (req, res, next) => {
  const hotelId = req.params.id;
  try {
    //find the hotel first to define and delete its rooms first
    const hotel = await Hotel.findById(hotelId);
    //delete the hotel images from disk storage
    if (hotel.photos && hotel.photos.length > 0) {
      hotel.photos.forEach((image) => {
        if (image.startsWith("http")) {
          return hotel.photos.filter((photo) => photo !== image);
        } else {
          const imagePath = path.join("./public/Images", image);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err);
              next(err);
            }
          });
        }
      });
    }

    await Promise.all(
      hotel?.rooms?.map((room) => {
        return Room.findByIdAndDelete(room);
      }),
      hotel?.reviews?.map((reviewId) => {
        return Review.findByIdAndDelete(reviewId);
      })
    );

    /* for (let i = 0; i < hotel.rooms.length; i++) {
            const roomId = hotel.rooms[i];
            await Room.findByIdAndDelete(roomId);
        } */
    try {
      //delete the hotel
      await Hotel.findByIdAndDelete(hotelId);
    } catch (error) {
      next(error);
    }
    res.status(StatusCodes.OK).json("the Hotel has been Deleted Successfully");
  } catch (error) {
    next(error);
  }
};
