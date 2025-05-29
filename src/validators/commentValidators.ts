import {body} from "express-validator";

export const commentCreateValidator = [
    body('content')
        .isString().withMessage('Content must be a string')
        .trim()
        .isLength({ min: 20, max: 300 })
        .withMessage('Content length must be between 20 and 300')
];
export const likeStatusValidator = [
    body('likeStatus')
        .isIn(['Like', 'Dislike', 'None'])
        .withMessage('likeStatus must be Like, Dislike or None')
];