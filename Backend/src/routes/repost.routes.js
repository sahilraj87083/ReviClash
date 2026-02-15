import { Router } from "express";
import { param, query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cursorDatePaginationValidation } from "../utils/cursorDatePaginationValidation.js";

import {
    toggleRepost,
    getAllRepostedPosts
} from "../controllers/repost.controller.js";

const router = Router();

router.route("/:postId")
.post(
    verifyJWT,
    [param("postId").isMongoId().withMessage("Invalid post ID")],
    validate,
    toggleRepost
);

router.route("/")
.get(
    verifyJWT,
    cursorDatePaginationValidation,
    validate,
    getAllRepostedPosts
);

export default router;
