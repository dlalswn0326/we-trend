import { NextResponse } from 'next/server';
import { fetchGNews, fetchNaverNews } from '@/lib/news';
import { summarizeNews } from '@/lib/ai';
import { prisma } from '@/lib/prisma';

// Keywords to search for
const KEYWORDS = ['AI', 'Crypto', 'Fintech'];

export async function GET() {
    try {
        let allNews: any[] = [];

        // Fetch from GNews (English)
        for (const keyword of KEYWORDS) {
            const gnews = await fetchGNews(keyword);
            allNews = [...allNews, ...gnews];
        }

        // Fetch from Naver (Korean)
        for (const keyword of KEYWORDS) {
            const naverNews = await fetchNaverNews(keyword);
            allNews = [...allNews, ...naverNews];
        }

        // Deduplicate news by URL
        allNews = Array.from(new Map(allNews.map(item => [item.url, item])).values());

        // Process and save news
        const savedPosts = [];
        const botUser = await prisma.user.upsert({
            where: { email: 'bot@wenners.com' },
            update: {},
            create: {
                email: 'bot@wenners.com',
                name: 'Trend Bot',
                image: 'https://api.dicebear.com/7.x/bottts/svg?seed=wenners',
            },
        });

        for (const news of allNews) {
            // Use upsert to handle race conditions and duplicates
            try {
                // Check if already exists (optimization to avoid AI cost if possible, but upsert is safer)
                // Actually, if we want to avoid AI cost, we should check first.
                // But to be 100% safe against race conditions, we should use upsert.
                // However, we can't generate summary inside upsert 'create' if we want to avoid generating it when 'update' happens.
                // So we stick to findFirst, but catch the error on create.

                const existing = await prisma.post.findUnique({
                    where: { sourceUrl: news.url },
                });

                if (!existing) {
                    // Use AI to summarize
                    const summary = await summarizeNews(news.title, news.description || '', news.source);

                    await prisma.post.create({
                        data: {
                            content: summary,
                            sourceUrl: news.url,
                            title: news.title,
                            authorId: botUser.id,
                            tags: KEYWORDS.join(','),
                        },
                    });
                    savedPosts.push({ title: news.title });
                }
            } catch (error: any) {
                // Ignore unique constraint violation (P2002)
                if (error.code === 'P2002') {
                    console.log(`Skipping duplicate: ${news.url}`);
                } else {
                    console.error(`Error saving post ${news.url}:`, error);
                }
            }
        }

        return NextResponse.json({
            message: `Fetched and processed ${savedPosts.length} new articles`,
            count: savedPosts.length
        });
    } catch (error) {
        console.error('News fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}
