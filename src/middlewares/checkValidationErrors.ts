import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';
import ValidationError from "../errors/ValidationError";
import FieldError from "../errorHandling/fieldError";

const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const fieldErrors: Array<FieldError> = errors.array().map((value) => {
            if(value.type === 'field') {
                return {
                    fieldName: value.path,
                    message: value.msg
                };
            }
            return {
                fieldName: '',
                message: value.msg
            }
        });
        return next(new ValidationError('Invalid values', fieldErrors));
    }
    next();
}

export default checkValidationErrors;