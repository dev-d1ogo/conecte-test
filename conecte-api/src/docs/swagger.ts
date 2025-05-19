import { ExpressAdapter } from '@nestjs/platform-express'
import { INestApplication } from '@nestjs/common'
import * as swaggerUi from 'swagger-ui-express'
import * as fs from 'fs'
import * as path from 'path'

export function setupManualSwagger(app: INestApplication): void {
    const jsonPath = path.resolve(process.cwd(), 'src/docs/swagger.json')
    // ou outro caminho
    const swaggerDocument = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))

    const expressApp = app.getHttpAdapter() as ExpressAdapter
    const instance = expressApp.getInstance()

    instance.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}
