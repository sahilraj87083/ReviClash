import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getInbox, getPrivateMessages, clearPrivateConversation } from "../controllers/privateMessage.controller.js";
import { param } from "express-validator";

const router = Router()


router.route("/inbox").get(
    verifyJWT, 
    getInbox
);


router.route('/inbox/:otherUserId').get(
    verifyJWT,
    [
        param("otherUserId")
            .isMongoId()
            .withMessage("Invalid Mongodb ID")
    ],
    validate,
    getPrivateMessages
)

router.route('/inbox/:otherUserId').delete(
    verifyJWT,
    [
        param("otherUserId")
            .isMongoId()
            .withMessage("Invalid Mongodb ID")
    ],
    validate,
    clearPrivateConversation
)


export default router
