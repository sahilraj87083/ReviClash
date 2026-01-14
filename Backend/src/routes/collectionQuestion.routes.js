import { Router } from "express";
import { body, param } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  addQuestionToCollection,
  removeQuestionFromCollection,
  bulkAddQuestions,
  bulkRemoveQuestions,
  reorderCollectionQuestions,
  removeAllQuestions
} from "../controllers/collectionQuestion.controller.js";

const router = Router();

// add question to the collection
router.route("/:collectionId/questions")
.post(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),

        body("questionId")
        .isMongoId()
        .withMessage("Invalid question ID"),
    ],
    validate,
    addQuestionToCollection
);



// reorder collection
router.route("/:collectionId/questions/:questionId/order")
.patch(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),

        param("questionId")
        .isMongoId()
        .withMessage("Invalid question ID"),

        body("order")
        .isInt({ min: 0 })
        .withMessage("Order must be a non-negative integer"),
    ],
    validate,
    reorderCollectionQuestions
);

// bulk add questions
router.route("/:collectionId/questions/bulk")
.post(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),

        body("questionIds")
        .isArray({ min: 1 })
        .withMessage("questionIds must be a non-empty array"),

        body("questionIds.*")
        .isMongoId()
        .withMessage("Each questionId must be a valid Mongo ID"),
    ],
    validate,
    bulkAddQuestions
);

// bulk remove
router.route("/:collectionId/questions/bulk")
.delete(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),

        body("questionIds")
        .isArray({ min: 1 })
        .withMessage("questionIds must be a non-empty array"),

        body("questionIds.*")
        .isMongoId()
        .withMessage("Each questionId must be a valid Mongo ID"),
    ],
    validate,
    bulkRemoveQuestions
);

// remove all questions from collection
router.route("/:collectionId/questions")
.delete(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),
    ],
    validate,
    removeAllQuestions
);

// remove a question from collection
router.route("/:collectionId/questions/:questionId")
.delete(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),

        param("questionId")
        .isMongoId()
        .withMessage("Invalid question ID"),
    ],
    validate,
    removeQuestionFromCollection
);

export default router;
