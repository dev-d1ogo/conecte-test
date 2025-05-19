import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { ApplicationError } from '@/shared/Errors'
import { errorDispatcher } from '@/helpers/ErrorDispatcher'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log("Essa é a exceçao", exception)

        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()

        // Se for erro da sua app, usa seu dispatcher
        if (exception instanceof ApplicationError) {
            return errorDispatcher(exception, response)
        }

        // Se for HttpException nativa do Nest (BadRequestException, etc.)
        if (exception instanceof HttpException) {
            const status = exception.getStatus()
            const message = exception.getResponse()

            return response.status(status).json({
                message,
                code: status,
                type: 'HTTP_EXCEPTION'
            })
        }

        // Qualquer erro não tratado
        return errorDispatcher(exception, response)
    }
}
