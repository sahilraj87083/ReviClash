import { Router } from "express";
import { query } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { cursorDatePaginationValidation } from "../utils/cursorDatePaginationValidation.js";

import {
    getGeneralfeed,
    getFriendsFeed
} from "../controllers/feed.controller.js";

const router = Router();


router.route("/general")
.get(
    verifyJWT,
    cursorDatePaginationValidation,
    validate,
    getGeneralfeed
);

router.route("/friends")
.get(
    verifyJWT,
    cursorDatePaginationValidation,
    validate,
    getFriendsFeed
);

export default router;
