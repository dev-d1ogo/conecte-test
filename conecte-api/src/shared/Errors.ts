export interface AppErrorType<T extends string = string> {
    message: string;
    code: number;
    type: T;
}

export interface ValidationErrorDescription {
    code: string;
    field: string;
    message: string;
}

export interface ValidationErrorType<T extends string = string> extends AppErrorType<T> {
    errors: ValidationErrorDescription[];
}

export class ApplicationError<T extends string = string> extends Error {
    public readonly code: number;
    public readonly type: T;

    constructor({ message, code, type }: AppErrorType<T>) {
        super(message);
        this.code = code;
        this.type = type;
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }

    toHttpResponse(): AppErrorType {
        const httpResponse: AppErrorType = {
            message: this.message,
            code: this.code,
            type: this.type,
        };

        return { ...httpResponse };
    }
}

export class ValidationError<T extends string = string> extends ApplicationError {
    public readonly errors: ValidationErrorDescription[];

    constructor({ message, code, type, errors }: ValidationErrorType<T>) {
        super({ message, code, type });

        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    toHttpResponse(): ValidationErrorType {
        const httpResponse: ValidationErrorType = {
            message: this.message,
            errors: this.errors,
            code: this.code,
            type: this.type,
        };

        console.log(httpResponse);

        return { ...httpResponse };
    }
}
