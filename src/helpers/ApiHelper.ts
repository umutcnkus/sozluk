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
