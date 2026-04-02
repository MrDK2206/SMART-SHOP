import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

function buildAuthPayload(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    mobileNumber: user.mobileNumber,
    billingAddress: user.billingAddress,
    pincode: user.pincode,
    panNumber: user.panNumber,
    gstNumber: user.gstNumber,
    shippingAddress: user.shippingAddress,
    token: generateToken(user._id)
  };
}

export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    mobileNumber,
    billingAddress,
    pincode,
    panNumber,
    gstNumber
  } = req.validated.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Required registration fields are missing");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase()
  });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    mobileNumber,
    billingAddress,
    pincode,
    panNumber: panNumber.toUpperCase(),
    gstNumber: gstNumber?.toUpperCase() || "",
    privacyPolicyAcceptedAt: new Date()
  });

  res.status(201).json(buildAuthPayload(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(buildAuthPayload(user));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { body } = req.validated;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = body.name ?? user.name;
  user.email = body.email?.toLowerCase() ?? user.email;
  user.mobileNumber = body.mobileNumber ?? user.mobileNumber;
  user.billingAddress = body.billingAddress ?? user.billingAddress;
  user.pincode = body.pincode ?? user.pincode;
  user.gstNumber = body.gstNumber?.toUpperCase() ?? user.gstNumber;
  if (body.shippingAddress) {
    user.shippingAddress = body.shippingAddress;
  }

  const updatedUser = await user.save();
  res.json(buildAuthPayload(updatedUser));
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email, mobileNumber, panNumber } = req.validated.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
    mobileNumber,
    panNumber: panNumber.toUpperCase()
  });

  if (user) {
    user.passwordResetRequests.push({
      requestedAt: new Date(),
      status: "Pending",
      note: "User requested a manual password reset."
    });
    await user.save();
  }

  res.json({
    message:
      "If the details matched our records, a password reset request has been submitted for admin review."
  });
});
