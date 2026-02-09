import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { body, param } from "express-validator";

const router = Router()

import {
    sendOTP,
    verifyOTP
} from '../controllers/otp.controller.js'


router.route('/send').post(
    [
        body("email").isEmail().withMessage("Invalid email"),
    ],
    validate,
    sendOTP
)

router.route('/verify').post(
    [
        body("email").isEmail().withMessage("Invalid email"),
        body('otp').trim().isLength(6).withMessage('OTP must be of length 6')
    ],
    validate,
    verifyOTP
)

export default router