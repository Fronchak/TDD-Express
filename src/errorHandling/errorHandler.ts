import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/BadRequestError";
import EntityNotFoundError from "../errors/EntityNotFoundError";
import ValidationError from "../errors/ValidationError";
import ApiError from "../errors/ApiError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof ValidationError) {
        res.status(err.statusCode()).json({
            message: err.message,
            errors: err.getErrors()
        });
    }
    else if(err instanceof ApiError) {
        res.status(err.statusCode()).json({
            message: err.message
        });
    }
    else {
        res.status(500).json({
            message: err.message
        });
    }
}

export default errorHandler;