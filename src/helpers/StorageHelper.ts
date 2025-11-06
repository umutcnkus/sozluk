// Helper functions for localStorage operations

export interface FavoriteWord {
    word: string;
    timestamp: number;
}

export interface SearchHistoryItem {
    word: string;
    timestamp: number;
}

// Favorites Management
export const addToFavorites = (word: string): void => {
    const favorites = getFavorites();
    // Check if already exists
    if (!favorites.find(f => f.word === word)) {
        favorites.unshift({ word, timestamp: Date.now() });
        // Keep only last 100 favorites
        if (favorites.length > 100) {
            favorites.pop();
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
};

export const removeFromFavorites = (word: string): void => {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.word !== word);
    localStorage.setItem('favorites', JSON.stringify(filtered));
};

export const getFavorites = (): FavoriteWord[] => {
    try {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const isFavorite = (word: string): boolean => {
    const favorites = getFavorites();
    return favorites.some(f => f.word === word);
};

// Search History Management
export const addToHistory = (word: string): void => {
    const history = getHistory();
    // Remove if already exists to move to top
    const filtered = history.filter(h => h.word !== word);
    filtered.unshift({ word, timestamp: Date.now() });
    // Keep only last 50 searches
    if (filtered.length > 50) {
        filtered.pop();
    }
    localStorage.setItem('searchHistory', JSON.stringify(filtered));
};

export const getHistory = (): SearchHistoryItem[] => {
    try {
        const stored = localStorage.getItem('searchHistory');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const clearHistory = (): void => {
    localStorage.removeItem('searchHistory');
};

// Copy to Clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
};

// Share functionality
export const shareContent = (text: string, url?: string): void => {
    if (navigator.share) {
        navigator.share({
            text: text,
            url: url || window.location.href
        }).catch(() => {
            // Fallback to copy if sharing fails
            copyToClipboard(text + '\n' + (url || window.location.href));
        });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(text + '\n' + (url || window.location.href));
    }
};
