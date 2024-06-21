import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CreateError } from "../utils/customError.js";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";

//register
export const register = async (req, res, next) => {
  try {
    const isExist = await User.findOne({ email: req.body.email });
    if (!isExist) {
      // hashed password
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({
        ...req.body,
        password: hash,
      });
      //save user in database
      await newUser.save();
      res
        .status(StatusCodes.CREATED)
        .json({ msg: "user has been created", user: newUser });
    } else {
      return next(
        CreateError(StatusCodes.FORBIDDEN, "you already Signed Up before")
      );
    }
  } catch (error) {
    next(error);
  }
};

//login
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(CreateError(StatusCodes.NOT_FOUND, "User not Found"));
    }
    //compare passwords
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(
        CreateError(StatusCodes.BAD_REQUEST, "Wrong password, please try again")
      );
    }
    //generate token for user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(StatusCodes.OK)
      .json({ details: { ...otherDetails }, token: token });
  } catch (error) {
    next(error);
  }
};
export const adminLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(CreateError(StatusCodes.NOT_FOUND, "User not Found"));
    }
    //compare passwords
    if (user.role !== "admin") {
      return next(CreateError(StatusCodes.NOT_FOUND, "You are not authorized"));
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(
        CreateError(StatusCodes.BAD_REQUEST, "Wrong password, please try again")
      );
    }
    //generate token for user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );
    const { password, role, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(StatusCodes.OK)
      .json({ details: { ...otherDetails }, role, token: token });
  } catch (error) {
    next(error);
  }
};

export const forget_password = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(CreateError(StatusCodes.NOT_FOUND, "User not Found"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10s",
    });
    res.status(StatusCodes.OK).json({ Status: "Success" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "kgo91754@gmail.com",
        pass: "pere jxev xsaq lmmx",
      },
    });
    const mailOptions = {
      from: "kgo91754@gmail.com",
      to: user.email,
      subject: "Reset Password",
      html:
        "<p>Please click on the following link to verify your email address:</p>" +
        `https://itravel-gamma.vercel.app/reset_password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error in sending email  " + error);
        return true;
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    next(error);
  }
};

export const reset_password = async (req, res, next) => {
  const { id, token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.send({ Status: "Error with Token" });
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          User.findByIdAndUpdate(
            { _id: id },
            { $set: { password: hash } },
            { new: true }
          )
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: err }));
        })
        .catch((err) => res.send({ Status: err }));
    }
  });
};
