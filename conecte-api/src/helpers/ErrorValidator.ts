import { z } from "zod";
import { ApplicationError, ValidationError, ValidationErrorDescription } from "../shared/Errors";

/**
 * Valida os dados para criação de marcador
 * @throws Error se a validação falhar
 */

export class RequestValidator {
    static validate<T>(data: unknown, schema: Zod.ZodSchema<T>): T {
        try {
            return schema.parse(data);
        } catch (error) {
            if (error instanceof z.ZodError) {

                throw new ValidationError({
                    message: "Validation Error",
                    code: 400,
                    type: "ValidationError",
                    errors: error.issues.map((e) => {
                        const error: ValidationErrorDescription = {
                            code: e.code,
                            message: e.message,
                            field: e.path.map(String).join('.') || '<root>',
                        };

                        return error;
                    }),
                });
            }

            throw new ApplicationError({
                message: "Internal Server Error",
                code: 500,
                type: "INTERNAL_SERVER",
            });
        }
    }
}
