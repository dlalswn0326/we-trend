const interests = [
    'AI가 신기한',
    '핀테크에 관심있는',
    '코인하는',
    '블록체인 좋아하는',
    '메타버스 꿈꾸는',
    '웹3.0 탐험하는',
    '스타트업 꿈꾸는',
    '개발 좋아하는',
    '디자인하는',
    '마케팅하는',
    '데이터 분석하는',
    '클라우드 탐험하는',
];

const animals = [
    '원숭이',
    '코알라',
    '흰바위 염소',
    '판다',
    '호랑이',
    '사자',
    '토끼',
    '여우',
    '펭귄',
    '돌고래',
    '독수리',
    '치타',
    '코끼리',
    '기린',
    '늑대',
];

export function generateRandomNickname(): string {
    const randomInterest = interests[Math.floor(Math.random() * interests.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    return `${randomInterest} ${randomAnimal}`;
}
