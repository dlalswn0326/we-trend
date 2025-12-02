const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to connect to Supabase...')
        const userCount = await prisma.user.count()
        console.log('✅ Connection successful!')
        console.log('Current User count:', userCount)
    } catch (e) {
        console.error('❌ Connection failed:', e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
