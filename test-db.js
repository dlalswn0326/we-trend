const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Attempting to connect to database...');
    try {
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! User count: ${userCount}`);

        const posts = await prisma.post.findMany();
        console.log(`Successfully fetched posts! Post count: ${posts.length}`);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
