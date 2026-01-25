import { Router } from "express";
import { param, query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  getUserStats,
  getUserTopicStats,
  getUserContestHistory,
  getLeaderboard,
} from "../controllers/userStats.controller.js";

const router = Router();


// global leaderboard 
router.route("/leaderboard")
.get(
    verifyJWT,
    [
        query("page")
            .optional()
            .isInt({ min: 1 }),

        query("limit")
            .optional()
            .isInt({ min: 1, max: 50 }),
    ],
    validate,
    getLeaderboard
);

// user profile stats
router.route("/:userId")
.get(
    verifyJWT,
    [
        param("userId")
            .isMongoId()
            .withMessage("Invalid user ID"),
    ],
    validate,
    getUserStats
);

// get use topic stats 
router.route("/:userId/topics")
.get(
    verifyJWT,
    [
        param("userId")
            .isMongoId()
            .withMessage("Invalid user ID"),
    ],
    validate,
    getUserTopicStats
);

// user contest history
router.route("/:userId/history")
.get(
    verifyJWT,
    [
        param("userId")
            .isMongoId()
            .withMessage("Invalid user ID"),

        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Invalid page number"),

        query("limit")
            .optional()
            .isInt({ min: 1, max: 50 })
            .withMessage("Invalid limit"),
    ],
    validate,
    getUserContestHistory
);



export default router;
