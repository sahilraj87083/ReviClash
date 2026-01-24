import { Router } from "express";
import { body, param } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
    joinContest,
    leaveContest,
    enterLiveContest,
    getLiveTimer,
    submitContest,
    getMyContestRank,
    getMyParticipantState,
    getContestParticipants,
} from "../controllers/contestParticipant.controller.js";

const router = Router();




// join contest
router.route("/:identifier/join")
.post(
    verifyJWT,
    [
        param("identifier")
            .isLength({ min: 3 })
            .withMessage("Invalid contest id or code"),
    ],
    validate,
    joinContest
);

// leave contest
router.route("/:contestId/leave")
.delete(
    verifyJWT,
    [param("contestId").isMongoId().withMessage("Invalid contest ID")],
    validate,
    leaveContest
);

// start contest (user timer)
router.route("/:contestId/start")
.post(
    verifyJWT,
    [param("contestId").isMongoId().withMessage("Invalid contest ID")],
    validate,
    enterLiveContest
);

// live contest timer

router.route("/:contestId/time")
.get(
    verifyJWT,
    [param("contestId").isMongoId().withMessage("Invalid contest ID")],
    validate,
    getLiveTimer
)

// submit contest
router.route("/:contestId/submit")
.post(
    verifyJWT,
    [
        param("contestId")
            .isMongoId()
            .withMessage("Invalid contest ID"),

        body("attempts")
            .optional()
            .isArray()
            .withMessage("Attempts must be an array"),

        body("attempts.*.questionId")
            .if(body("attempts").exists())
            .isMongoId()
            .withMessage("Invalid question ID in attempts"),

        body("attempts.*.status")
            .if(body("attempts").exists())
            .isIn(["solved", "unsolved"])
            .withMessage("Invalid status"),

        body("attempts.*.timeSpent")
            .if(body("attempts").exists())
            .isInt({ min: 0 })
            .withMessage("timeSpent must be a positive number"),
    ],
    validate,
    submitContest
);


// get my ranking in contest
router.route("/:contestId/rank")
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

// my participant state
router.route("/:contestId/me")
.get(
    verifyJWT,
    [param("contestId").isMongoId().withMessage("Invalid contest ID")],
    validate,
    getMyParticipantState
);

// all participants (lobby)
router.route("/:contestId/participants")
.get(
    verifyJWT,
    [param("contestId").isMongoId().withMessage("Invalid contest ID")],
    validate,
    getContestParticipants
);




export default router;
