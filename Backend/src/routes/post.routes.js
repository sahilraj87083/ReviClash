import { Router } from "express";
import { body, param, query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { cursorDatePaginationValidation } from "../utils/cursorDatePaginationValidation.js";

import {
    addPost,
    deletePost,
    getAllPost,
    getPostById,
    editPost
} from "../controllers/post.controller.js";

const router = Router();

const cursorPaginationValidation = [
    query("cursor").optional().isISO8601().withMessage("Invalid cursor"),
    query("limit")
        .optional()
        .toInt()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50"),
];

// Create Post
router.route("/")
.post(
    verifyJWT,
    upload.fields([
        { name: "images", maxCount: 10 },
        { name: "videos", maxCount: 1 }
    ]),
    [
        body("visibility")
            .optional()
            .isIn(["general", "friends"])
            .withMessage("Invalid visibility"),
    ],
    validate,
    addPost
);

// Get All Posts
router.route("/")
.get(
    verifyJWT,
    cursorDatePaginationValidation, // pagination based on date
    validate,
    getAllPost
);

// Get Post By Id
router.route("/:postId")
.get(
    verifyJWT,
    [param("postId").isMongoId().withMessage("Invalid post ID")],
    validate,
    getPostById
);

// Edit Post
router.route("/:postId")
.patch(
    verifyJWT,
    [
        param("postId").isMongoId().withMessage("Invalid post ID"),
        body("visibility")
            .optional()
            .isIn(["general", "friends"])
            .withMessage("Invalid visibility"),
    ],
    validate,
    editPost
);

// Delete Post
router.route("/:postId")
.delete(
    verifyJWT,
    [param("postId").isMongoId().withMessage("Invalid post ID")],
    validate,
    deletePost
);

export default router;
