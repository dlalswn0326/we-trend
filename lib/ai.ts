const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export async function summarizeNews(title: string, content: string, source: string): Promise<string> {
    if (!GOOGLE_API_KEY) {
        console.warn('GOOGLE_API_KEY is missing');
        return `[AI 요약 예시] ${title}\n\nAPI 키가 설정되지 않아 시뮬레이션 요약을 보여드립니다. 실제 AI가 연결되면 이 내용을 한국어로 번역하고 소셜 미디어 스타일로 요약해 줄 거예요! 🤖 #테크 #뉴스`;
    }

    try {
        const prompt = `You are a tech-savvy social media influencer.
Read the following news article and summarize it into a catchy, 3-line social media post in Korean.
Use an informal, engaging tone (SNS style).
Include 2-3 relevant hashtags.

Source: ${source}
Title: ${title}
Content: ${content}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        return text.trim();
    } catch (error) {
        console.error('AI Summarization error:', error);
        return `${title} (AI 요약 실패)`;
    }
}

export async function extractKeywords(texts: string[], query?: string): Promise<string[]> {
    if (!GOOGLE_API_KEY) {
        console.warn('GOOGLE_API_KEY is missing');
        // Fallback: simple keyword extraction (remove common words, split etc.)
        const sampleKeywords = ['기술', '개발', 'AI', '소프트웨어', '웹', '모바일', '데이터', '클라우드', '보안', '뉴스'];
        return sampleKeywords.slice(0, 5);
    }

    try {
        const textContent = texts.join(' ').substring(0, 3000); // Limit text length
        const queryPart = query ? `Related to the query: "${query}"` : 'Common themes';
        const prompt = `Extract 5-8 key keywords or phrases in Korean from the following post contents, focusing on ${queryPart}. Return them as a comma-separated list. Keywords should be relevant for search suggestions.

Posts content:
${textContent}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const keywords = text.trim().split(',').map((k: string) => k.trim()).filter(Boolean);
        return keywords.slice(0, 8);
    } catch (error) {
        console.error('AI Keyword extraction error:', error);
        return ['기술', '개발', 'AI', '소프트웨어'];
    }
}
