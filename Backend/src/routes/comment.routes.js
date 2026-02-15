import { Router } from "express";
import { body, param, query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cursorDatePaginationValidation } from "../utils/cursorDatePaginationValidation.js";


import {
    addComment,
    deleteComment,
    getAllComment,
    editComment
} from "../controllers/comment.controller.js";

const router = Router();

const cursorPaginationValidation = [
    query("cursor").optional().isISO8601().withMessage("Invalid cursor"),
    query("limit")
        .optional()
        .toInt()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50"),
];

// Add Comment
router.route("/:postId")
.post(
    verifyJWT,
    [
        param("postId").isMongoId().withMessage("Invalid post ID"),
        body("content")
            .trim()
            .isLength({ min: 1, max: 2000 })
            .withMessage("Comment must be between 1 and 2000 characters"),
    ],
    validate,
    addComment
);

// Get Comments
router.route("/:postId")
.get(
    verifyJWT,
    [
        param("postId").isMongoId().withMessage("Invalid post ID"),
        ...cursorDatePaginationValidation
    ],
    validate,
    getAllComment
);

// Edit Comment
router.route("/edit/:commentId")
.patch(
    verifyJWT,
    [
        param("commentId").isMongoId().withMessage("Invalid comment ID"),
        body("content")
            .trim()
            .isLength({ min: 1, max: 2000 })
            .withMessage("Comment must be between 1 and 2000 characters"),
    ],
    validate,
    editComment
);

// Delete Comment
router.route("/:commentId")
.delete(
    verifyJWT,
    [param("commentId").isMongoId().withMessage("Invalid comment ID")],
    validate,
    deleteComment
);

export default router;
