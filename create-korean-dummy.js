const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        // Create a user
        const user = await prisma.user.upsert({
            where: { email: 'korean@example.com' },
            update: {},
            create: {
                email: 'korean@example.com',
                name: 'Korean User',
            },
        })

        // Create a post
        const post = await prisma.post.create({
            data: {
                content: '이것은 한국어 게시물입니다. 검색을 테스트합니다.',
                authorId: user.id,
                tags: '한국어,테스트,검색',
            },
        })

        console.log('Created Korean post:', post)
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
