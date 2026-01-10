import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.utils.js";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, "Validation error", errors.array());
    }

    next()
};

export {
    validate
}

export default validate