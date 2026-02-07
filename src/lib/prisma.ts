
import { PrismaClient } from '@prisma/client'

// On définit une variable globale pour éviter de créer 
// trop de connexions pendant le développement (Hot Reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// On exporte "prisma" de manière nommée (const)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Optionnel : affiche les requêtes SQL dans ton terminal
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma