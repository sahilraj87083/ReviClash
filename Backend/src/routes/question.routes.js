import {
    updateQuestion,
    deleteQuestion,
    getAllQuestions,
    getQuestionById,
    uploadQuestion
} from '../controllers/question.controller.js'
import { Router } from 'express'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {validate} from '../middlewares/validate.middleware.js'
import { body , query, param} from 'express-validator'

const router = Router()

//  create a question
router.route("/")
.post(
    verifyJWT,
    [
        body("title")
            .trim()
            .isLength({min : 2})
            .withMessage("Title must be at least 2 characters long"),

        body("platform")
            .isIn(["LeetCode", "GFG", "Codeforces", "Other"])
            .withMessage("Invalid platform"),

        body("problemUrl")
            .isURL()
            .withMessage("Invalid problem URL"),
        
        body("difficulty")
            .isIn(["easy", "medium", "hard"])
            .withMessage("Invalid difficulty"),

        body("topics")
            .optional()
            .isArray()
            .withMessage("Topics must be an array of strings")
    ],
    validate,
    uploadQuestion
)


// get all questions

router.route("/")
.get(
    verifyJWT,
    [
        query("difficulty")
            .optional()
            .isIn(["easy", "medium", "hard"]),

        query("platform")
            .optional()
            .isIn(["LeetCode", "GFG", "Codeforces", "Other"]),

        query("topic")
            .optional()
            .isString(),

        query("mode")
            .optional()
            .isIn(["any", "all"]),

        query("page")
            .optional()
            .isInt({ min: 1 }),

        query("limit")
            .optional()
            .isInt({ min: 1, max: 50 })
    ],
    validate,
    getAllQuestions
)

//  get question by id

router.route("/:questionId")
.get(
    verifyJWT,
    [
        param("questionId")
            .isMongoId()
            .withMessage("Invalid Question ID")
    ],
    validate,
    getQuestionById
);


// update question

router.route("/:questionId")
.patch(
    verifyJWT,
    [
        param("questionId")
            .isMongoId()
            .withMessage("Invalid Question ID"),

        body("title")
            .optional()
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long"),

        body("difficulty")
            .optional()
            .isIn(["easy", "medium", "hard"]),

        body("platform")
            .optional()
            .isIn(["LeetCode", "GFG", "Codeforces", "Other"])
    ],
    validate,
    updateQuestion
);

router.route("/:questionId")
.delete(
    verifyJWT,
    [
        param("questionId")
            .isMongoId()
            .withMessage("Invalid Question ID")
    ],
    validate,
    deleteQuestion
);


export default router