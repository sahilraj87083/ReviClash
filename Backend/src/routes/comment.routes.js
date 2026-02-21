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

// Add Comment
router.route("/:postId")
.post(
    verifyJWT,
    [
        param("postId").isMongoId().withMessage("Invalid post ID"),
        body("content")
            .trim()
            .isLength({ min: 1, max: 1500 })
            .withMessage("Comment must be between 1 and 1500 characters"),
        body("parentId")
            .optional({ nullable: true, checkFalsy: true })
            .isMongoId()
            .withMessage("Invalid parent comment ID")
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
        query("parentId")
            .optional()
            .isMongoId()
            .withMessage("Invalid parent comment ID"),
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
