export interface ValidationError {
    field: string;
    errors: string[];
}


export interface ValidationErrorResponse {
    error: string;
    message: ValidationError[];
    statusCode: number;
    path: string;
    date: Date;
}

export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
    path: string;
    date: Date;
}