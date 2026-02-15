import { Router } from "express";
import { param, query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    togglePostLike,
    getAllLikedPost
} from "../controllers/like.controller.js";
import { cursorDatePaginationValidation } from "../utils/cursorDatePaginationValidation.js";


const router = Router();

router.route("/:postId")
.post(
    verifyJWT,
    [param("postId").isMongoId().withMessage("Invalid post ID")],
    validate,
    togglePostLike
);

router.route("/")
.get(
    verifyJWT,
    cursorDatePaginationValidation,
    validate,
    getAllLikedPost
);

export default router;
