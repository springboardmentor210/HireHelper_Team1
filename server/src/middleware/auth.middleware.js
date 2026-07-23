import jwt from "jsonwebtoken";

import User from "../models/User.js";

import ApiError from "../utils/ApiError.js";

import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {

    let token;

    // Check Authorization Header

    if (

        req.headers.authorization &&

        req.headers.authorization.startsWith("Bearer ")

    ) {

        token = req.headers.authorization.split(" ")[1];

    }

    // No Token

    if (!token) {

        return res

            .status(401)

            .json(

                new ApiError(

                    401,

                    "Access denied. No token provided."

                )

            );

    }

    // Verify Token

    const decoded = jwt.verify(

        token,

        process.env.JWT_SECRET

    );

    // Find User

    const user = await User.findById(

        decoded.userId

    ).select("-password -otp -otpExpiry");

    if (!user) {

        return res

            .status(401)

            .json(

                new ApiError(

                    401,

                    "User not found."

                )

            );

    }

    // Attach User

    req.user = user;

    next();

});