import {asyncHandler} from '../utils/AsyncHandler.utils.js'
import {ApiResponse} from '../utils/ApiResponse.utils.js'

const healthcheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "Ok", { message: "Everything is O.K" }));
});

export { healthcheck };