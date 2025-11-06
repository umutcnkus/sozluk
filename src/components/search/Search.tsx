import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { WordDefinition } from '../../models/interfaces';
import { getHistory, getFavorites } from '../../helpers/StorageHelper';
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
            wordOfTheDay: this.getWordOfTheDay()
        }
    }

    componentDidMount() {
        this.loadRecentSearches();
    }

    loadRecentSearches = () => {
        const history = getHistory();
        this.setState({ recentSearches: history.slice(0, 5) });
    }

    getWordOfTheDay = (): string => {
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const index = dayOfYear % WORD_LIST.length;
        return WORD_LIST[index];
    }

    handleKeyDown(e: any) {
        if (e.key === 'Enter') {
            const word = e?.target.value.trim();
            if (word) {
                window.location.hash = word;
            }
        }
    }

    handleSearchClick = (word: string) => {
        this.props.history.push(`/${word}`);
    }

    handleFavoritesClick = () => {
        this.props.history.push('/favorites');
    }

    render() {
        const { recentSearches, wordOfTheDay } = this.state;
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
                        <input className="search-box" type="text"
                            placeholder="sözcük ara"
                            onKeyDown={(e) => this.handleKeyDown(e)}
                            autoFocus>
                        </input>
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
