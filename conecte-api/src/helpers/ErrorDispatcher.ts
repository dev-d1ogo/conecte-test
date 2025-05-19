import { ApplicationError } from "@/shared/Errors";
import { Response } from "express";

export function errorDispatcher(error: any, res: Response) {
    if (error instanceof ApplicationError) {
        const httpResponse = error.toHttpResponse();

        return res.status(httpResponse.code).send({ ...httpResponse });
    }

    return res.status(500).send({
        message: "Internal Server Error",
        code: 500,
        type: "INTERNAL_SERVER_ERROR",
        details: error.message || null,
    });
}
