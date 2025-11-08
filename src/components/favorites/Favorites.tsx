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

    handleFlashcardsClick = () => {
        this.props.history.push('/flashcards');
    }

    handleExport = () => {
        const { favorites } = this.state;
        const dataStr = JSON.stringify(favorites, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sozluk-favorilerim-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    try {
                        const importedFavorites = JSON.parse(event.target.result);
                        if (Array.isArray(importedFavorites)) {
                            // Merge with existing favorites, avoiding duplicates
                            const existing = getFavorites();
                            const existingWords = new Set(existing.map(f => f.word));
                            const newFavorites = importedFavorites.filter(
                                (f: FavoriteItem) => !existingWords.has(f.word)
                            );
                            const merged = [...existing, ...newFavorites];
                            localStorage.setItem('favorites', JSON.stringify(merged));
                            this.loadFavorites();
                            alert(`${newFavorites.length} yeni favori eklendi!`);
                        } else {
                            alert('Geçersiz dosya formatı');
                        }
                    } catch (error) {
                        alert('Dosya okunurken hata oluştu');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    render() {
        const { favorites } = this.state;

        return (
            <div className="favorites-container">
                <div className="favorites-header">
                    <button className="back-button" onClick={this.handleBackToHome} aria-label="Ana sayfaya dön">
                        ← Ana Sayfa
                    </button>
                    <div className="header-content">
                        <h1 className="favorites-title">Favorilerim</h1>
                        <span className="favorites-count">{favorites.length} kelime</span>
                    </div>
                    {favorites.length > 0 && (
                        <div className="export-import-buttons">
                            <button className="flashcards-button" onClick={this.handleFlashcardsClick} aria-label="Flashcards ile çalış">
                                📇 Çalış
                            </button>
                            <button className="export-button" onClick={this.handleExport} aria-label="Favorileri dışa aktar">
                                Dışa Aktar
                            </button>
                            <button className="import-button" onClick={this.handleImport} aria-label="Favorileri içe aktar">
                                İçe Aktar
                            </button>
                        </div>
                    )}
                </div>

                {favorites.length === 0 ? (
                    <div className="empty-state" role="status">
                        <span className="empty-icon" aria-hidden="true">☆</span>
                        <p className="empty-text">Henüz favori kelimen yok</p>
                        <p className="empty-subtext">Kelime sayfalarındaki yıldız butonuna tıklayarak favorilere ekleyebilirsin</p>
                        <button className="import-button-empty" onClick={this.handleImport} aria-label="Favorileri içe aktar">
                            İçe Aktar
                        </button>
                    </div>
                ) : (
                    <ul className="favorites-grid">
                        {favorites.map((fav, index) => (
                            <li key={index} className="favorite-card">
                                <button
                                    className="favorite-word"
                                    onClick={() => this.handleWordClick(fav.word)}
                                    aria-label={`${fav.word} kelimesini görüntüle`}
                                >
                                    {fav.word}
                                </button>
                                <button
                                    className="remove-button"
                                    onClick={() => this.handleRemove(fav.word)}
                                    title="Favorilerden çıkar"
                                    aria-label={`${fav.word} kelimesini favorilerden çıkar`}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }

}
