import FieldError from "../errorHandling/fieldError";
import ApiError from "./ApiError";

class ValidationError extends ApiError {
    private errors: Array<FieldError> = [];
    
    constructor(msg: string, errors: Array<FieldError>) {
        super(msg);
        this.errors = errors;
    }

    getErrors = (): Array<FieldError> => {
        return [ ...this.errors ];
    }

    statusCode(): number {
        return 422;
    }
}

export default ValidationError;