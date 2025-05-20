import { PrismaClient, Prisma } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {

    const existingDoctor = await prisma.user.findUnique({
        where: { email: 'doutor@exemplo.com' },
    })

    if (existingDoctor) {
        console.log(' Seed não executado: dados já existem.')
        return
    }

    const password = bcrypt.hashSync('123456', 10)


    // 👨‍⚕️ Criação do médico
    const doctor = await prisma.user.create({
        data: {
            name: 'Dr. João Silva',
            email: 'doutor@exemplo.com',
            password,
            role: 'DOCTOR',
        },
    })

    // 🧍 Criação de dois pacientes
    const patient1 = await prisma.user.create({
        data: {
            name: 'Maria Souza',
            email: 'paciente1@exemplo.com',
            password,
            role: 'PATIENT',
        },
    })

    const patient2 = await prisma.user.create({
        data: {
            name: 'Carlos Mendes',
            email: 'paciente2@exemplo.com',
            password,
            role: 'PATIENT',
        },
    })

    // 🕒 Gerar horários disponíveis (segunda a sexta, entre 07:00 e 17:00)
    const today = new Date()
    const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) // amanhã

    const slotsToCreate: Prisma.AvailableSlotCreateManyInput[] = []

    for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate)
        date.setDate(date.getDate() + i)

        const dayOfWeek = date.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) continue // pula domingo e sábado

        for (let hour = 7; hour < 17; hour += 2) {
            const slotDate = new Date(date)
            slotDate.setHours(hour, 0, 0, 0)
            slotsToCreate.push({
                doctorId: doctor.id,
                dateTime: slotDate,
                isBooked: false,
            })
        }
    }

    const createdSlots = await prisma.availableSlot.createMany({
        data: slotsToCreate,
    })

    const allSlots = await prisma.availableSlot.findMany({
        where: { doctorId: doctor.id },
        orderBy: { dateTime: 'asc' },
    })

    // 📅 Criar agendamentos para 2 slots
    const selectedSlots = allSlots.slice(0, 2)

    await prisma.scheduling.create({
        data: {
            doctorId: doctor.id,
            patientId: patient1.id,
            slotId: selectedSlots[0].id,
            dateTime: selectedSlots[0].dateTime,
        },
    })

    await prisma.availableSlot.update({
        where: { id: selectedSlots[0].id },
        data: { isBooked: true },
    })

    await prisma.scheduling.create({
        data: {
            doctorId: doctor.id,
            patientId: patient2.id,
            slotId: selectedSlots[1].id,
            dateTime: selectedSlots[1].dateTime,
        },
    })

    await prisma.availableSlot.update({
        where: { id: selectedSlots[1].id },
        data: { isBooked: true },
    })

    console.log('✅ Seed finalizado com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
