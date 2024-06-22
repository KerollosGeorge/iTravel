import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { StatusCodes } from "http-status-codes";
import { CreateError } from "../utils/customError.js";
import path from "path";
import fs from "fs";

//get all rooms
export const GetAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(StatusCodes.OK).json(rooms);
  } catch (error) {
    next(error);
  }
};

//get a specific room
export const GetRoom = async (req, res, next) => {
  const date = new Date();
  const formattedDate =
    date.toISOString().split("T")[0] + "T22:00:00.000+00:00";

  try {
    const room = await Room.findById(req.params.id);

    await Promise.all(
      room.roomNumbers.map(async (roomNumber) => {
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
      })
    );

    res.status(StatusCodes.OK).json(await room.save());
  } catch (error) {
    next(error);
  }
};

//create new room
export const CreateRoom = async (req, res, next) => {
  const { files, body } = req;
  const { urlImages, roomNumbers } = body;

  let photos = []; // Declare photos variable here

  // handle files
  if (files && files.length > 0) {
    photos = files.map((file) => file.filename);
  }

  // handle urls
  if (urlImages) {
    const Images = urlImages.split(",");
    photos = [...photos, ...Images];
  }

  // Parse roomNumbers string into an array of objects with the correct format

  const parsedRoomNumbers =
    Array.isArray(roomNumbers) && roomNumbers.length > 0
      ? roomNumbers
      : Array.isArray(JSON.parse(roomNumbers))
      ? JSON.parse(roomNumbers)
      : JSON.parse(roomNumbers).map((room) => ({
          number: room.number,
          unavailableDates: [],
        }));

  const newRoom = new Room({
    photos: photos,
    roomNumbers: parsedRoomNumbers,
    title: body.title,
    price: body.price,
    maxPeople: body.maxPeople,
    desc: body.desc,
  });

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findOneAndUpdate(
        { HotelName: req.body.HotelName },
        {
          $push: { rooms: savedRoom._id },
        }
      );
    } catch (error) {
      next(error);
    }
    res
      .status(StatusCodes.CREATED)
      .json({ savedRoom, msg: "Room has been Created successfully" });
  } catch (error) {
    next(error);
  }
};

//update info of a specifc room
export const UpdateRoom = async (req, res, next) => {
  const { files, body } = req;
  const { urlImages, roomNumbers } = body;
  let photos = [];

  // handle files
  if (files && files.length > 0) {
    photos = files.map((file) => file.filename);
  }

  // handle urls
  if (urlImages && urlImages !== "") {
    const Images = urlImages.split(",");
    photos = [...photos, ...Images];
  }
  // Parse roomNumbers string into an array of objects with the correct format
  const parsedRoomNumbers =
    Array.isArray(roomNumbers) && roomNumbers.length > 0
      ? roomNumbers
      : Array.isArray(JSON.parse(roomNumbers))
      ? JSON.parse(roomNumbers)
      : JSON.parse(roomNumbers).map((room) => ({
          number: room.number,
          unavailableDates: [],
        }));
  try {
    const room = await Room.findById(req.params.id);
    if (room.photos.length > 0) {
      await Promise.all(
        room.photos.map(async (image) => {
          if (image.startsWith("http")) {
            return room.photos.filter((photo) => photo !== image);
          } else {
            const imagePath = path.join("./public/Images", image);
            try {
              await fs.promises.stat(imagePath);
              await fs.promises.unlink(imagePath);
            } catch (error) {
              // file does not exist, skip it
            }
          }
        })
      );
    }
    try {
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        {
          photos: photos,
          roomNumbers: parsedRoomNumbers,
          title: body.title,
          price: body.price,
          maxPeople: body.maxPeople,
          desc: body.desc,
        },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ updatedRoom, msg: "Room has been Updated successfully" });
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

//update room availability
//if user book the room the room availability (unavailableDates) attr. must be updated
export const UpdateRoomAvailability = async (req, res, next) => {
  try {
    const startDate = new Date(req.body.date[0].startDate);
    const endDate = new Date(req.body.date[0].endDate);
    const room = await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $set: {
          "roomNumbers.$.unavailableDates": [startDate, endDate],
        },
      },
      { new: true }
    );
    /*     if (!room) {
      return next(CreateError(StatusCodes.NOT_FOUND, "There is no such room!"));
    } */
    // Return the updated room number object
    res
      .status(StatusCodes.OK)
      .json({ Msg: "Room status has been updated.", room });
  } catch (error) {
    next(error);
  }
};

//delete a room
export const DeleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const roomId = req.params.roomId;
  try {
    await Room.findByIdAndDelete(roomId);
    try {
      await Hotel.findByIdAndUpdate(
        hotelId,
        { $pull: { rooms: roomId } },
        { new: true }
      );
    } catch (error) {
      next(error);
    }
    res.status(StatusCodes.OK).json("Room has been Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

//delete a room using the roomId only
export const DeleteSpecificRoom = async (req, res, next) => {
  const roomId = req.params.roomId;
  try {
    const find_room = await Room.findById(roomId);
    //delete the room images from disk storage
    if (find_room.photos && find_room.photos.length > 0) {
      find_room.photos.forEach((image) => {
        if (image.startsWith("http")) {
          return find_room.photos.filter((photo) => photo !== image);
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
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return next(CreateError(StatusCodes.NOT_FOUND, "There is no such room!"));
    }
    try {
      const hotels = await Hotel.find({
        rooms: { $in: [roomId] },
      });
      if (!hotels || hotels.length === 0) {
        return next(
          CreateError(StatusCodes.NOT_FOUND, "No such room " + roomId)
        );
      } else {
        Promise.all(
          hotels.map((hotel) => {
            if (hotel.rooms.includes(roomId)) {
              hotel.rooms = hotel.rooms.filter((id) => id != roomId);
            }
            return hotel.save();
          })
        )
          .then(() => {
            res
              .status(StatusCodes.OK)
              .json("Room has been Deleted Successfully");
          })
          .catch((err) => {
            next(err);
          });
      }
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

export const GetHotelFromRoom = async (req, res, next) => {
  try {
    const hotel = await Hotel.find({ rooms: { $in: [req.params.id] } });
    res.status(StatusCodes.OK).json(hotel);
  } catch (error) {
    next(error);
  }
};
