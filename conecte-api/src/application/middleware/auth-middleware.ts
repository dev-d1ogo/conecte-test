import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { IAuthService } from '@/core/services/IAuthService'
import { ApplicationError } from '@/shared/Errors'
import { UserErrorType } from '@/shared/errors/UserErrorTypes'
import { Inject } from '@nestjs/common'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        @Inject(IAuthService) private readonly authService: IAuthService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization']
        const token = authHeader?.split(' ')[1]

        if (!token) {
            throw new ApplicationError({
                message: 'Token não fornecido',
                code: 401,
                type: UserErrorType.UNAUTHORIZED
            })
        }

        const decoded = await this.authService.verifyToken(token)

        if (!decoded) {
            throw new ApplicationError({
                message: 'Token inválido ou expirado',
                code: 401,
                type: UserErrorType.UNAUTHORIZED
            })
        }

        req.user = decoded
        next()
    }
}
