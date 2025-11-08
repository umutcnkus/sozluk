import { basePath } from '../config';
import { WordData, WordDefinition } from '../models/interfaces';

// Legacy function for backward compatibility
export const getDefinition = (word: string): Promise<WordDefinition[]> => {
    const requestUrl = basePath + 'gts?ara=' + word;
    return fetch(requestUrl)
        .then((response) => response.json())
        .then((data) =>
            data[0].anlamlarListe.map((anlam: { anlam: any }) => {
                return {
                    text: anlam.anlam,
                };
            })
        );
};

// New function to get full word data with all features
export const getWordData = (word: string): Promise<WordData | null> => {
    const requestUrl = basePath + 'gts?ara=' + word;
    return fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data && data.length > 0) {
                return data[0] as WordData;
            }
            return null;
        })
        .catch((error) => {
            console.error('Error fetching word data:', error);
            return null;
        });
};

// Autocomplete with TDK API
export const getAutocompleteSuggestions = (query: string): Promise<string[]> => {
    if (!query || query.length < 2) {
        return Promise.resolve([]);
    }

    const requestUrl = basePath + 'gts?ara=' + encodeURIComponent(query);
    return fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data && Array.isArray(data)) {
                // Extract word suggestions from API results
                return data.slice(0, 10).map((item: WordData) => item.madde);
            }
            return [];
        })
        .catch((error) => {
            console.error('Error fetching autocomplete:', error);
            return [];
        });
};

// Get related words (compounds)
export const getRelatedWords = (word: string): Promise<{ compounds: string[], related: string[] }> => {
    return getWordData(word)
        .then((wordData) => {
            if (!wordData) {
                return { compounds: [], related: [] };
            }

            const compounds = wordData.birlesikler
                ? wordData.birlesikler.split(',').map(w => w.trim()).filter(w => w.length > 0)
                : [];

            // Get words from same etymology/origin as "related"
            const related: string[] = [];

            return { compounds, related };
        })
        .catch(() => {
            return { compounds: [], related: [] };
        });
};
