import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getFavorites, removeFromFavorites } from '../../helpers/StorageHelper';
import './Favorites.css';

export interface FavoritesProps extends RouteComponentProps { }

export interface FavoriteItem {
    word: string;
    timestamp: number;
}

export interface FavoritesState {
    favorites: FavoriteItem[];
}

export class Favorites extends React.Component<FavoritesProps, FavoritesState> {

    constructor(props: FavoritesProps) {
        super(props);
        this.state = {
            favorites: []
        }
    }

    componentDidMount() {
        this.loadFavorites();
    }

    loadFavorites = () => {
        const favorites = getFavorites();
        this.setState({ favorites });
    }

    handleRemove = (word: string) => {
        removeFromFavorites(word);
        this.loadFavorites();
    }

    handleWordClick = (word: string) => {
        this.props.history.push(`/${word}`);
    }

    handleBackToHome = () => {
        this.props.history.push('/');
    }

    render() {
        const { favorites } = this.state;

        return (
            <div className="favorites-container">
                <div className="favorites-header">
                    <button className="back-button" onClick={this.handleBackToHome}>
                        ← Ana Sayfa
                    </button>
                    <h1 className="favorites-title">Favorilerim</h1>
                    <span className="favorites-count">{favorites.length} kelime</span>
                </div>

                {favorites.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">☆</span>
                        <p className="empty-text">Henüz favori kelimen yok</p>
                        <p className="empty-subtext">Kelime sayfalarındaki yıldız butonuna tıklayarak favorilere ekleyebilirsin</p>
                    </div>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((fav, index) => (
                            <div key={index} className="favorite-card">
                                <div
                                    className="favorite-word"
                                    onClick={() => this.handleWordClick(fav.word)}
                                >
                                    {fav.word}
                                </div>
                                <button
                                    className="remove-button"
                                    onClick={() => this.handleRemove(fav.word)}
                                    title="Favorilerden çıkar"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }

}
