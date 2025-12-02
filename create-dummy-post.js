const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        // Create a user first
        const user = await prisma.user.upsert({
            where: { email: 'test@example.com' },
            update: {},
            create: {
                email: 'test@example.com',
                name: 'Test User',
                profileImage: 'https://github.com/shadcn.png'
            },
        })

        // Create a post
        const post = await prisma.post.create({
            data: {
                content: 'This is a dummy post for verification.',
                authorId: user.id,
                tags: 'test,verification',
            },
        })

        console.log('Created post:', post)
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
