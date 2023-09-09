import { body } from "express-validator";

const personInputValidator = [
    body('firstName').notEmpty().withMessage('First name is required').notEmpty({ ignore_whitespace: true }).withMessage('First name cannot be blank'),
    body('lastName').notEmpty().withMessage('Last name is required').notEmpty({ ignore_whitespace: true }).withMessage('Last name cannot be blank')
];

export default personInputValidator;