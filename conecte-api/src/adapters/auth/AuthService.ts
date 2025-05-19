import { User } from '@/core/entities/User'
import { UserRole } from '@/core/enums/UserRole'
import { UserJwt } from '@/core/models/UserJwt'
import { IAuthService } from '@/core/services/IAuthService'
import { Injectable } from '@nestjs/common'

import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthService implements IAuthService {
    private readonly secret = process.env.JWT_SECRET || 'dev-secret'
    private readonly expiresIn = process.env.JWT_EXPIRES_IN || '24h'

    hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10)
    }

    verifyPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword)
    }

    async generateToken(user: User, expire?: string): Promise<string> {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        }

        return jwt.sign(payload, this.secret, {
            expiresIn: expire || this.expiresIn
        })
    }

    async verifyToken(token: string): Promise<UserJwt | null> {
        try {
            const decoded = jwt.verify(token, this.secret) as jwt.JwtPayload

            return {
                name: decoded.name,
                id: decoded.sub as string,
                email: decoded.email,
                role: decoded.role as UserRole
            }
        } catch {
            return null
        }
    }
}
