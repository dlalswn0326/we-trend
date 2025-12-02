import axios from 'axios';

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

export interface NewsItem {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: string;
}

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
    const entities: { [key: string]: string } = {
        '&quot;': '"',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&apos;': "'",
    };

    return text.replace(/&[a-z]+;|&#\d+;/gi, (match) => entities[match] || match);
}

export async function fetchGNews(query: string): Promise<NewsItem[]> {
    try {
        const response = await axios.get(`https://gnews.io/api/v4/search`, {
            params: {
                q: query,
                lang: 'en', // Fetch in English as requested
                token: GNEWS_API_KEY,
                max: 8,
            },
        });

        return response.data.articles.map((article: any) => ({
            title: decodeHtmlEntities(article.title),
            description: decodeHtmlEntities(article.description),
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source.name,
        }));
    } catch (error) {
        console.error('GNews fetch error:', error);
        return [];
    }
}

export async function fetchNaverNews(query: string): Promise<NewsItem[]> {
    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/news.json', {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
            params: {
                query: query,
                display: 8,
                sort: 'date',
            },
        });

        return response.data.items.map((item: any) => ({
            title: decodeHtmlEntities(item.title.replace(/<[^>]+>/g, '')), // Remove HTML tags and decode entities
            description: decodeHtmlEntities(item.description.replace(/<[^>]+>/g, '')),
            url: item.link,
            publishedAt: item.pubDate,
            source: 'Naver News',
        }));
    } catch (error) {
        console.error('Naver News fetch error:', error);
        return [];
    }
}
