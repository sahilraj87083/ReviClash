import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUsername,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserProfile,
    verifyEmail,
    resendVerificationEmail,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    resetPassword,
    checkUsernameAvailability,
    searchUsers
} from "../controllers/user.controller.js";

import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { body, param } from "express-validator";

const router = Router();


// public routes

router.post(
    "/register",
    [
        body("email").isEmail().withMessage("Invalid email"),
        body('otp').isLength(3).withMessage("OTP must be of length 6"),
        body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
        body("fullName").isLength({ min: 3 }).withMessage("Full name must be at least 3 characters"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],
    validate,
    registerUser
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],
    validate,
    loginUser
);



router.get(
    "/c/:username",
    [
        param("username")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters")
    ],
    validate,
    getUserProfile
);

router.post("/refresh-token", refreshAccessToken);

// secured routes

router.post("/logout", verifyJWT, logoutUser);

router.post(
    "/change-password",
    verifyJWT,
    [
        body("oldPassword").isLength({ min: 6 }),
        body("newPassword").isLength({ min: 6 }),
        body("confirmPassword").isLength({ min: 6 })
    ],
    validate,
    changeCurrentPassword
);

router.get("/current-user", verifyJWT, getCurrentUser);

router.route("/search").get(verifyJWT, searchUsers);

router.patch(
    "/update-username",
    verifyJWT,
    [
        body("newUsername")
        .trim()
        .toLowerCase()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be 3-30 characters long")
        .matches(/^[a-z0-9._]+$/)
        .withMessage("Username can contain only letters, numbers, . and _")
    ],
    validate,
    updateUsername
);

router.route("/check-username/:username").get(
    [
        param("username")
        .trim()
        .toLowerCase()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be 3-30 characters long")
        .matches(/^[a-z0-9._]+$/)
        .withMessage("Username can contain only letters, numbers, . and _")
    ],
    validate,
    checkUsernameAvailability
);

router.patch(
    "/update-account",
    verifyJWT,
    [
        body("fullName").optional().isLength({ min: 3 }),
        body("bio").optional().isLength({ max: 300 })
    ],
    validate,
    updateAccountDetails
);

router.patch(
    "/update-avatar",
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

router.patch(
    "/update-coverImage",
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);


router.post("/forgot-password/send",
    [
        body('email').isEmail().withMessage("Invalid Email")
    ],
    validate,
    sendForgotPasswordOTP);


router.post("/forgot-password/verify",
    [
        body('email').isEmail().withMessage("Invalid Email"),
        body('otp').trim().isLength({min : 6, max : 6}).withMessage('OTP must be of length 6')
    ],
    validate,
    verifyForgotPasswordOTP);


router.post("/forgot-password/reset",
    [
        body('email').isEmail().withMessage("Invalid Email"),
        body("newPassword").trim().isLength({ min: 6 }),
        body("resetToken").trim().isLength({ min: 1 }),
    ],
    validate,
    resetPassword);


export default router;
