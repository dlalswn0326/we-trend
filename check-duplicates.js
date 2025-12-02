const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    try {
        const posts = await prisma.post.findMany({
            select: { sourceUrl: true }
        })

        const urlCounts = {}
        let duplicates = 0

        posts.forEach(p => {
            urlCounts[p.sourceUrl] = (urlCounts[p.sourceUrl] || 0) + 1
            if (urlCounts[p.sourceUrl] === 2) {
                duplicates++
                console.log('Duplicate URL:', p.sourceUrl)
            }
        })

        console.log(`Total Posts: ${posts.length}`)
        console.log(`Duplicate URLs found: ${duplicates}`)

        if (duplicates === 0 && posts.length > 0) {
            console.log('✅ No duplicates found.')
        } else if (posts.length === 0) {
            console.log('⏳ No posts yet.')
        } else {
            console.log('❌ Duplicates detected!')
        }

    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
