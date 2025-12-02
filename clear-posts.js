const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Clearing all posts...')
        await prisma.comment.deleteMany({})
        await prisma.interaction.deleteMany({})
        await prisma.post.deleteMany({})
        console.log('✅ All posts cleared.')
    } catch (e) {
        console.error('❌ Error clearing posts:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
