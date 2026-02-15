import { Router } from "express";
import { param, query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    toggleSavePost,
    getAllSavededPosts
} from "../controllers/savedPost.controller.js";
import { cursorDatePaginationValidation } from "../utils/cursorDatePaginationValidation.js";


const router = Router();

router.route("/:postId")
.post(
    verifyJWT,
    [param("postId").isMongoId().withMessage("Invalid post ID")],
    validate,
    toggleSavePost
);

router.route("/")
.get(
    verifyJWT,
    cursorDatePaginationValidation,
    validate,
    getAllSavededPosts
);

export default router;
