import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient()


export async function connectToDatabase() {
    try {
        await prismaClient.$connect();
        console.log("Conexão com o banco de dados bem-sucedida.");
    } catch (error) {
        console.error("❌ Erro ao conectar com o banco de dados:", error);
        process.exit(1); // encerra a aplicação se a conexão falhar
    }
}
