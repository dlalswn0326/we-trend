import { NextResponse } from 'next/server';
import { fetchGNews, fetchNaverNews } from '@/lib/news';
import { summarizeNews } from '@/lib/ai';
import { prisma } from '@/lib/prisma';

// Helper to get random item from array
function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function GET(request: Request) {
    try {
        // Optional: Verify Cron Secret
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Find or Create AI Bot User
        let botUser = await prisma.user.findFirst({
            where: { email: 'ai-bot@wetrend.app' }
        });

        if (!botUser) {
            botUser = await prisma.user.create({
                data: {
                    email: 'ai-bot@wetrend.app',
                    name: 'AI 트렌드 봇',
                    isAnonymous: false,
                    profileImage: 'https://api.dicebear.com/7.x/bottts/svg?seed=wetrend-bot', // Random bot avatar
                    bio: '최신 IT/AI 뉴스를 자동으로 요약해드립니다. 🤖'
                }
            });
        }

        // 2. Fetch News
        // Rotate keywords to keep content fresh
        const keywords = ['인공지능', 'AI 기술', '블록체인', '핀테크', '가상화폐', 'IT 트렌드'];
        const keyword = getRandomItem(keywords);

        console.log(`Fetching news for keyword: ${keyword}`);

        const [gNews, naverNews] = await Promise.all([
            fetchGNews('Artificial Intelligence technology'), // GNews is better with English queries
            fetchNaverNews(keyword)
        ]);

        const allNews = [...gNews, ...naverNews];

        if (allNews.length === 0) {
            return NextResponse.json({ message: 'No news found' });
        }

        // 3. Select random articles to summarize (limit to 10 for more content)
        const articlesToProcess = allNews.sort(() => 0.5 - Math.random()).slice(0, 10);
        const createdPosts = [];

        for (const article of articlesToProcess) {
            // Check if URL already exists to avoid duplicates
            const existingPost = await prisma.post.findUnique({
                where: { sourceUrl: article.url }
            });

            if (existingPost) continue;

            // 4. Summarize
            const summary = await summarizeNews(article.title, article.description, article.source);

            // 5. Create Post
            const post = await prisma.post.create({
                data: {
                    content: summary,
                    title: article.title,
                    sourceUrl: article.url,
                    authorId: botUser.id,
                    tags: '뉴스,AI요약,트렌드',
                }
            });

            createdPosts.push(post.id);
        }

        return NextResponse.json({
            success: true,
            processed: articlesToProcess.length,
            created: createdPosts.length,
            posts: createdPosts
        });

    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
