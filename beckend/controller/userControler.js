const Errorhandler = require("../utils/errrorhandeler");
const catchAsyncErrors = require("../middelware/catchAsyncerror");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");

const sendEmail = require("../utils/sendEmail.js");

exports.registeruser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profilepicUrl",
    },
  });

  sendToken(user,201,res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("Please enter Email & Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new Errorhandler("Invalid Email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new Errorhandler("Invalid Email or password", 401));
  }

  sendToken(user,200,res);
  });

  exports.logout = catchAsyncErrors(async(req,res,next)=>{


     res.cookie("token",null,{
      expires:new Date(Date.now()),
      httponly:true,
     });


    res.status(200).json({
      success:true,
      message : "logged out",
    });
  });

  exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new Errorhandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new Errorhandler(error.message, 500));
    }
  });


  exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      //resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new Errorhandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    //if (req.body.password !== req.body.confirmPassword) {
    //  return next(new Errorhandler("Password does not password", 400));
    //}
    console.log(req.body.password);
    console.log(req.body.confirmPassword);
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    //user.resetPasswordExpire = undefined;
  
    await user.save();
  
    sendToken(user, 200, res);
  });
  

  