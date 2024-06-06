import jwt from "jsonwebtoken";
import { CreateError } from "../utils/customError.js";
import { StatusCodes } from "http-status-codes";

//verify token
/* export const verifyToken = (req,res,next)=> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(CreateError(StatusCodes.UNAUTHORIZED, 'You are not Authenticated!'))
    }
    const token = authHeader.split(' ')[1];
    try{
        //payload
        const payload = jwt.verify(token,process.env.JWT_SECRET);

        //if the user has token then he could acces routes
        req.user = {userId: payload.userId, name: payload.name}
        next()
    }catch(error){
        return next(CreateError(StatusCodes.UNAUTHORIZED, 'Authentication Invalid'))
    }
} */
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(CreateError(StatusCodes.UNAUTHORIZED, "You are not allowed!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(CreateError(StatusCodes.FORBIDDEN, "Token is not Valid!")); //403 error (forbidden)
    }
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(
        CreateError(StatusCodes.FORBIDDEN, "You are not Authorized!")
      ); //forbidden user
    }
  });
};
//only user can update its info
export const verifyUpdatedUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return next(
        CreateError(StatusCodes.FORBIDDEN, "You are not Authorized!")
      ); //forbidden user
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(
        CreateError(StatusCodes.FORBIDDEN, "You are not Authorized!")
      ); //forbidden not Admin
    }
  });
};
