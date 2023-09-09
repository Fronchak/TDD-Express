abstract class ApiError extends Error {
    constructor(msg: string) {
        super(msg);
    }
    
    abstract statusCode(): number
}

export default ApiError;