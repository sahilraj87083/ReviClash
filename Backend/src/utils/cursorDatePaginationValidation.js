const cursorDatePaginationValidation = [
    query("cursor").optional().isISO8601().withMessage("Invalid cursor"),
    query("limit")
        .optional()
        .toInt()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50"),
];


export {
    cursorDatePaginationValidation
}