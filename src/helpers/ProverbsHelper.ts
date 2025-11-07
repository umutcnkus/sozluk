import { getWordData } from './ApiHelper';
import { Proverb } from '../models/interfaces';

const WORDS_WITH_PROVERBS = [
    'el', 'göz', 'baş', 'yol', 'taş', 'su', 'at', 'ev', 'kapı', 'dağ', 'deniz',
    'ağaç', 'altın', 'para', 'yürek', 'söz', 'iş', 'adam', 'çocuk', 'ana',
    'baba', 'kardeş', 'dost', 'yol', 'köy', 'şehir', 'yer', 'gün', 'gece'
];

export interface QuoteOfDay {
    text: string;
    word: string;
    timestamp: number;
}

export const getProverbsCache = (): Proverb[] => {
    const cached = localStorage.getItem('proverbsCache');
    if (cached) {
        return JSON.parse(cached);
    }
    return [];
};

export const setProverbsCache = (proverbs: Proverb[]): void => {
    localStorage.setItem('proverbsCache', JSON.stringify(proverbs));
};

export const getQuoteOfDay = (): QuoteOfDay | null => {
    const cached = localStorage.getItem('quoteOfDay');
    if (cached) {
        const quote = JSON.parse(cached);
        // Check if it's from today
        const today = new Date().toDateString();
        const quoteDate = new Date(quote.timestamp).toDateString();
        if (today === quoteDate) {
            return quote;
        }
    }
    return null;
};

export const setQuoteOfDay = (quote: QuoteOfDay): void => {
    localStorage.setItem('quoteOfDay', JSON.stringify(quote));
};

export const fetchRandomProverb = async (): Promise<QuoteOfDay | null> => {
    // Check if we have a quote for today
    const existingQuote = getQuoteOfDay();
    if (existingQuote) {
        return existingQuote;
    }

    // Try to get from cache first
    let proverbs = getProverbsCache();

    if (proverbs.length === 0) {
        // Fetch proverbs from API
        proverbs = await fetchProverbsFromAPI();
        if (proverbs.length > 0) {
            setProverbsCache(proverbs);
        }
    }

    if (proverbs.length > 0) {
        // Select proverb based on day of year for consistency
        const today = new Date();
        const dayOfYear = Math.floor(
            (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
            1000 / 60 / 60 / 24
        );
        const index = dayOfYear % proverbs.length;
        const selectedProverb = proverbs[index];

        const quote: QuoteOfDay = {
            text: selectedProverb.madde,
            word: 'Türk Atasözü',
            timestamp: Date.now()
        };

        setQuoteOfDay(quote);
        return quote;
    }

    return null;
};

const fetchProverbsFromAPI = async (): Promise<Proverb[]> => {
    const allProverbs: Proverb[] = [];

    // Fetch proverbs from a few words
    const wordsToFetch = WORDS_WITH_PROVERBS.slice(0, 10); // Fetch from first 10 words

    for (const word of wordsToFetch) {
        try {
            const data = await getWordData(word);
            if (data && data.atasozu && data.atasozu.length > 0) {
                allProverbs.push(...data.atasozu);
            }
        } catch (error) {
            console.error(`Error fetching proverbs for ${word}:`, error);
        }
    }

    return allProverbs;
};

// Get a list of Turkish words for autocomplete (most common Turkish words)
export const getTurkishWordSuggestions = (query: string): string[] => {
    const commonWords = [
        'aşk', 'sevgi', 'dostluk', 'umut', 'huzur', 'mutluluk', 'özgürlük', 'adalet',
        'cesaret', 'sabır', 'bilgelik', 'erdem', 'vefa', 'merhamet', 'alçakgönüllülük',
        'güzellik', 'sanat', 'edebiyat', 'şiir', 'hikaye', 'destan', 'masal',
        'hatıra', 'anı', 'hayat', 'ölüm', 'zaman', 'mekan', 'yolculuk', 'serüven',
        'deniz', 'dağ', 'gökyüzü', 'yıldız', 'ay', 'güneş', 'rüzgar', 'bulut',
        'çiçek', 'ağaç', 'orman', 'nehir', 'göl', 'kuş', 'kelebek', 'arı',
        'ev', 'yuva', 'aile', 'anne', 'baba', 'kardeş', 'dost', 'arkadaş',
        'kitap', 'kalem', 'kağıt', 'mektup', 'şarkı', 'müzik', 'dans', 'resim',
        'renk', 'ışık', 'gölge', 'ses', 'sessizlik', 'kelime', 'söz', 'dil',
        'akıl', 'kalp', 'ruh', 'beden', 'nefes', 'kan', 'gözyaşı', 'gülümseme',
        'yol', 'iz', 'adım', 'kapı', 'pencere', 'köprü', 'liman', 'ufuk',
        'başlangıç', 'son', 'devam', 'değişim', 'dönüşüm', 'gelişim', 'büyüme', 'olgunluk',
        'çocukluk', 'gençlik', 'yaşlılık', 'an', 'saniye', 'dakika', 'saat', 'gün',
        'hafta', 'ay', 'yıl', 'çağ', 'dönem', 'era', 'asır', 'devir',
        'yer', 'dünya', 'yeryüzü', 'toprak', 'vatan', 'ülke', 'şehir', 'kasaba',
        'köy', 'mahalle', 'sokak', 'meydan', 'park', 'bahçe', 'kır', 'yayla',
        'inanç', 'iman', 'din', 'vicdan', 'ahlak', 'değer', 'ilke', 'prensip',
        'doğruluk', 'dürüstlük', 'samimiyet', 'içtenlik', 'sadelik', 'tevazu', 'alçakgönüllülük',
        'şükür', 'kanaat', 'hoşgörü', 'anlayış', 'empati', 'şefkat', 'merhamet', 'acıma',
        'yardım', 'destek', 'katkı', 'fedakarlık', 'özveri', 'bağlılık', 'sadakat', 'vefa'
    ];

    if (!query || query.length === 0) {
        return [];
    }

    const lowerQuery = query.toLowerCase().replace(/ı/g, 'i');
    return commonWords
        .filter(word => word.toLowerCase().replace(/ı/g, 'i').startsWith(lowerQuery))
        .slice(0, 10);
};
