import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { WordDefinition } from '../../models/interfaces';
import { getHistory, getFavorites, copyToClipboard, shareContent } from '../../helpers/StorageHelper';
import { fetchRandomProverb, getTurkishWordSuggestions, QuoteOfDay } from '../../helpers/ProverbsHelper';
import './Search.css';

export interface OnboardingPageRouterProps {
    word: string
}
export interface SearchProps extends RouteComponentProps<OnboardingPageRouterProps> { }

export interface HistoryItem {
    word: string;
    timestamp: number;
}

export interface SearchState {
    definitions: WordDefinition[];
    recentSearches: HistoryItem[];
    wordOfTheDay: string;
    quoteOfDay: QuoteOfDay | null;
    searchQuery: string;
    suggestions: string[];
    showSuggestions: boolean;
    selectedSuggestionIndex: number;
}

const WORD_LIST = [
    'aşk', 'sevgi', 'dostluk', 'umut', 'huzur', 'mutluluk', 'özgürlük', 'adalet',
    'cesaret', 'sabır', 'bilgelik', 'erdem', 'vefa', 'merhamet', 'alçakgönüllülük',
    'güzellik', 'sanat', 'edebiyat', 'şiir', 'hikaye', 'destan', 'masal',
    'hatıra', 'anı', 'hayat', 'ölüm', 'zaman', 'mekan', 'yolculuk', 'serüven'
];

export class Search extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            definitions: [],
            recentSearches: [],
            wordOfTheDay: this.getWordOfTheDay(),
            quoteOfDay: null,
            searchQuery: '',
            suggestions: [],
            showSuggestions: false,
            selectedSuggestionIndex: -1
        }
    }

    componentDidMount() {
        this.loadRecentSearches();
        this.loadQuoteOfDay();
    }

    loadRecentSearches = () => {
        const history = getHistory();
        this.setState({ recentSearches: history.slice(0, 5) });
    }

    loadQuoteOfDay = async () => {
        try {
            const quote = await fetchRandomProverb();
            this.setState({ quoteOfDay: quote });
        } catch (error) {
            console.error('Error loading quote of day:', error);
        }
    }

    getWordOfTheDay = (): string => {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const index = dayOfYear % WORD_LIST.length;
        return WORD_LIST[index];
    }

    handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        this.setState({ searchQuery: query });

        if (query.length > 0) {
            const suggestions = getTurkishWordSuggestions(query);
            this.setState({
                suggestions,
                showSuggestions: suggestions.length > 0,
                selectedSuggestionIndex: -1
            });
        } else {
            this.setState({
                suggestions: [],
                showSuggestions: false,
                selectedSuggestionIndex: -1
            });
        }
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { suggestions, showSuggestions, selectedSuggestionIndex, searchQuery } = this.state;

        if (e.key === 'Enter') {
            e.preventDefault();
            if (showSuggestions && selectedSuggestionIndex >= 0) {
                const word = suggestions[selectedSuggestionIndex];
                this.navigateToWord(word);
            } else if (searchQuery.trim()) {
                this.navigateToWord(searchQuery.trim());
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (showSuggestions && suggestions.length > 0) {
                const newIndex = (selectedSuggestionIndex + 1) % suggestions.length;
                this.setState({ selectedSuggestionIndex: newIndex });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (showSuggestions && suggestions.length > 0) {
                const newIndex = selectedSuggestionIndex <= 0 ? suggestions.length - 1 : selectedSuggestionIndex - 1;
                this.setState({ selectedSuggestionIndex: newIndex });
            }
        } else if (e.key === 'Escape') {
            this.setState({ showSuggestions: false });
        }
    }

    navigateToWord = (word: string) => {
        this.setState({
            showSuggestions: false,
            searchQuery: '',
            selectedSuggestionIndex: -1
        });
        this.props.history.push(`/${word}`);
    }

    handleSuggestionClick = (word: string) => {
        this.navigateToWord(word);
    }

    handleSearchClick = (word: string) => {
        this.props.history.push(`/${word}`);
    }

    handleFavoritesClick = () => {
        this.props.history.push('/favorites');
    }

    handleCopyQuote = async () => {
        const { quoteOfDay } = this.state;
        if (quoteOfDay) {
            await copyToClipboard(`"${quoteOfDay.text}"\n\n— ${quoteOfDay.word}`);
        }
    }

    handleShareQuote = () => {
        const { quoteOfDay } = this.state;
        if (quoteOfDay) {
            shareContent(`"${quoteOfDay.text}"\n\n— ${quoteOfDay.word}`);
        }
    }

    handleDownloadQuote = () => {
        const { quoteOfDay } = this.state;
        if (!quoteOfDay) return;

        // Create canvas for image generation
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#F5E6D3');
        gradient.addColorStop(1, '#E8D4B8');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Card background
        const padding = 80;
        const cardX = padding;
        const cardY = padding;
        const cardWidth = canvas.width - padding * 2;
        const cardHeight = canvas.height - padding * 2;

        ctx.fillStyle = '#FFF8E7';
        ctx.fillRect(cardX, cardY, cardWidth, cardHeight);

        // Border
        ctx.strokeStyle = '#8B6B47';
        ctx.lineWidth = 6;
        ctx.strokeRect(cardX, cardY, cardWidth, cardHeight);

        // Inner border
        ctx.strokeStyle = 'rgba(139, 107, 71, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(cardX + 20, cardY + 20, cardWidth - 40, cardHeight - 40);

        // Quote mark
        ctx.fillStyle = '#D4A574';
        ctx.font = 'bold 200px Georgia';
        ctx.textAlign = 'left';
        ctx.fillText('"', cardX + 60, cardY + 220);

        // Quote text
        ctx.fillStyle = '#2C1810';
        ctx.font = 'italic 48px Georgia';
        ctx.textAlign = 'center';

        const maxWidth = cardWidth - 200;
        const words = quoteOfDay.text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        const lineHeight = 70;
        const startY = canvas.height / 2 - (lines.length * lineHeight) / 2;
        lines.forEach((line, index) => {
            ctx.fillText(line.trim(), canvas.width / 2, startY + index * lineHeight);
        });

        // Attribution
        ctx.fillStyle = '#6B4423';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`— ${quoteOfDay.word.toUpperCase()}`, canvas.width / 2, canvas.height - 150);

        // Download
        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sozluk-quote-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }
        });
    }

    render() {
        const { recentSearches, wordOfTheDay, quoteOfDay, searchQuery, suggestions, showSuggestions, selectedSuggestionIndex } = this.state;
        const favoritesCount = getFavorites().length;

        return (
            <React.Fragment>
                <div className="search-page">
                    <div className="navigation-bar">
                        <button className="nav-button favorites-nav" onClick={this.handleFavoritesClick}>
                            ★ Favorilerim ({favoritesCount})
                        </button>
                    </div>

                    <div className="search-box-container">
                        <input
                            className="search-box"
                            type="text"
                            placeholder="sözcük ara"
                            value={searchQuery}
                            onChange={this.handleSearchInput}
                            onKeyDown={this.handleKeyDown}
                            autoFocus
                        />
                        {showSuggestions && (
                            <div className="autocomplete-dropdown">
                                {suggestions.map((word, index) => (
                                    <div
                                        key={index}
                                        className={`autocomplete-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                                        onClick={() => this.handleSuggestionClick(word)}
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="features-container">
                        {wordOfTheDay && (
                            <div className="word-of-day-card">
                                <span className="card-icon">📖</span>
                                <h3 className="card-title">Günün Kelimesi</h3>
                                <div
                                    className="word-of-day-word"
                                    onClick={() => this.handleSearchClick(wordOfTheDay)}
                                >
                                    {wordOfTheDay}
                                </div>
                            </div>
                        )}

                        {quoteOfDay && (
                            <div className="quote-of-day-card">
                                <span className="card-icon">✨</span>
                                <h3 className="card-title">Günün Sözü</h3>
                                <div className="quote-text">
                                    {quoteOfDay.text}
                                </div>
                                <div className="quote-attribution">
                                    {quoteOfDay.word}
                                </div>
                                <div className="quote-actions">
                                    <button
                                        className="quote-action-btn"
                                        onClick={this.handleCopyQuote}
                                    >
                                        📋 Kopyala
                                    </button>
                                    <button
                                        className="quote-action-btn"
                                        onClick={this.handleShareQuote}
                                    >
                                        📤 Paylaş
                                    </button>
                                    <button
                                        className="quote-action-btn primary"
                                        onClick={this.handleDownloadQuote}
                                    >
                                        📥 İndir
                                    </button>
                                </div>
                            </div>
                        )}

                        {recentSearches.length > 0 && (
                            <div className="recent-searches-card">
                                <span className="card-icon">🕐</span>
                                <h3 className="card-title">Son Aramalar</h3>
                                <div className="recent-list">
                                    {recentSearches.map((item, index) => (
                                        <div
                                            key={index}
                                            className="recent-item"
                                            onClick={() => this.handleSearchClick(item.word)}
                                        >
                                            {item.word}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        )
    }

}
