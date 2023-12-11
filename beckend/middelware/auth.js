
const catchAsyncerror = require("./catchAsyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Errorhandler = require("../utils/errrorhandeler");

exports.isAuthenticateduser = catchAsyncerror(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new Errorhandler("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles =(...roles)=>{
  return(req,res,next)=>{
    if(!roles.includes(req.user.role)){
    return next(  new Errorhandler(`Role:${req.user.role} is not allowwed to access this resources`,403)
    )};
    next();
  };
};