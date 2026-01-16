import { Router } from "express";
import { body, param } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createContest,
  joinContest,
  submitContest,
  getContestLeaderboard,
  getContest,
  getMyContestRank
} from "../controllers/contest.controller.js";

const router = Router();

// create contest
router.route("/")
.post(
    verifyJWT,
    [
        body("collectionId")
            .isMongoId()
            .withMessage("Invalid collection ID"),

        body("title")
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage("Title must be between 3 and 100 characters"),

        body("durationInMin")
            .isInt({ min: 1, max: 720 })
            .withMessage("Duration must be between 1 and 720 minutes"),

        body("questionCount")
            .isInt({ min: 1, max: 10})
            .withMessage("Invalid question count"),

        body("visibility")
            .optional()
            .isIn(["private", "shared", "public"])
            .withMessage("Invalid visibility"),
    ],
    validate,
    createContest
);

// get contest page
router.route("/:contestId")
.get(
    verifyJWT,
    [
        param("contestId")
            .isLength({ min: 3 })
            .withMessage("Invalid contest ID or code"),
    ],
    validate,
    getContest
);

// join contest
router.route("/:id/join")
.post(
    verifyJWT,
    [
        param("id")
            .isLength({ min: 3 })
            .withMessage("Invalid contest ID or code"),
    ],
    validate,
    joinContest
);

// submit contest
router.route("/:contestId/submit")
.post(
    verifyJWT,
    [
        param("contestId")
            .isMongoId()
            .withMessage("Invalid contest ID"),

        body("attempts")
            .isArray({ min: 1 })
            .withMessage("Attempts must be a non-empty array"),

        body("attempts.*.questionId")
            .isMongoId()
            .withMessage("Invalid question ID in attempts"),

        body("attempts.*.status")
            .isIn(["solved", "unsolved"])
            .withMessage("Invalid status"),

        body("attempts.*.timeSpent")
            .isInt({ min: 0 })
            .withMessage("timeSpent must be a positive number"),
    ],
    validate,
    submitContest
);

// leader board
router.route("/:contestId/leaderboard")
.get(
    verifyJWT,
    [
        param("contestId")
            .isMongoId()
            .withMessage("Invalid contest ID"),
    ],
    validate,
    getContestLeaderboard
);

// user ranking in contest
router.route("/:contestId/me")
.get(
    verifyJWT,
    [
        param("contestId")
            .isMongoId()
            .withMessage("Invalid contest ID"),
    ],
    validate,
    getMyContestRank
);

export default router;
