import { Router } from "express";
import { body, param } from "express-validator";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createCollection,
  deleteCollections,
  getMyCollections,
  getCollectionById,
  updateCollection,
  getCollectionQuestions,
  getPublicCollectionQuestions
} from "../controllers/collection.controller.js";

const router = Router();

// create collection
router.route("/")
.post(
    verifyJWT,
    [
        body("name")
          .trim()
          .isLength({ min: 2, max: 100 })
          .withMessage("Collection name must be between 2 and 100 characters"),

        body("description")
            .optional()
            .isLength({ max: 300 })
            .withMessage("Description must be under 300 characters"),

        body("isPublic")
            .optional()
            .isBoolean()
            .withMessage("isPublic must be a boolean"),
    ],
    validate,
    createCollection
);

// get all collections
router.route("/")
.get(
    verifyJWT,
    getMyCollections
);

// get collection by id
router.route("/:collectionId")
.get(
    verifyJWT,
    [
        param("collectionId")
        .isMongoId()
        .withMessage("Invalid collection ID"),
    ],
    validate,
    getCollectionById
);

// update collection
router.route("/:collectionId")
.patch(
    verifyJWT,
    [
      param("collectionId")
          .isMongoId()
          .withMessage("Invalid collection ID"),

      body("name")
          .optional()
          .trim()
          .isLength({ min: 2, max: 100 })
          .withMessage("Collection name must be between 2 and 100 characters"),

      body("description")
          .optional()
          .isLength({ max: 300 })
          .withMessage("Description must be under 300 characters"),

      body("isPublic")
          .optional()
          .isBoolean()
          .withMessage("isPublic must be a boolean"),
    ],
    validate,
    updateCollection
);

// delete collection
router.route("/:collectionId")
.delete(
    verifyJWT,
    [
      param("collectionId")
          .isMongoId()
          .withMessage("Invalid collection ID"),
    ],
    validate,
    deleteCollections
);



// get all the questions of the collection
router.route("/:collectionId/questions")
.get(
    verifyJWT,
    [
        param("collectionId")
            .isMongoId()
            .withMessage("Invalid collection ID"),
    ],
    validate,
    getCollectionQuestions
);

router.route('/public/:collectionId/questions')
.get(
    [
        param('collectionId')
            .isMongoId()
            .withMessage("Invalid collection ID"),
    ],
    validate,
    getPublicCollectionQuestions
)



export default router;