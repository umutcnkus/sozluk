import React from 'react';
import { Animated } from "react-animated-css";
import { RouteComponentProps } from 'react-router-dom';
import { getWordData } from '../../helpers/ApiHelper';
import { WordDefinition, WordData } from '../../models/interfaces';
import {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToHistory,
    copyToClipboard,
    shareContent
} from '../../helpers/StorageHelper';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import './WordCard.css';

export interface OnboardingPageRouterProps {
    word: string
}
export interface WordCardProps extends RouteComponentProps<OnboardingPageRouterProps> { }

export interface WordCardState {
    definitions: WordDefinition[];
    word: string;
    isVisible: boolean;
    wordData: WordData | null;
    isFavorited: boolean;
    copiedItem: string | null;
    isLoading: boolean;
    error: string | null;
}

export class WordCard extends React.Component<WordCardProps, WordCardState> {

    constructor(props: WordCardProps) {
        super(props);
        this.state = {
            definitions: [],
            word: "",
            isVisible: false,
            wordData: null,
            isFavorited: false,
            copiedItem: null,
            isLoading: false,
            error: null
        }
    }

    toggleFavorite = () => {
        const { word, isFavorited } = this.state;
        if (isFavorited) {
            removeFromFavorites(word);
        } else {
            addToFavorites(word);
        }
        this.setState({ isFavorited: !isFavorited });
    }

    handleCopy = async (text: string, itemId: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            this.setState({ copiedItem: itemId });
            setTimeout(() => {
                this.setState({ copiedItem: null });
            }, 2000);
        }
    }

    handleShare = (text: string) => {
        shareContent(text, window.location.href);
    }

    componentDidMount() {
        this.searchWordFromUrl();
        window.addEventListener("hashchange", (e) => this.searchWordFromUrl());
    }

    searchWordFromUrl() {
        const { word } = this.props.match.params;
        const wordToSearch = decodeURIComponent(word).toLowerCase();
        this.getDefinition(wordToSearch)
    }

    getDefinition(word: string) {
        // Set loading state
        this.setState({
            isLoading: true,
            error: null,
            isVisible: false
        });

        // Use the new API to get full word data
        getWordData(word)
            .then((wordData: WordData | null) => {
                if (wordData) {
                    // Extract definitions from the full data for backward compatibility
                    const definitions = wordData.anlamlarListe.map(anlam => ({
                        text: anlam.anlam
                    }));
                    // Add to search history
                    addToHistory(word);
                    // Check if favorited
                    const favorited = isFavorite(word);
                    this.setState({
                        definitions: definitions,
                        word: word,
                        isVisible: true,
                        wordData: wordData,
                        isFavorited: favorited,
                        isLoading: false,
                        error: null
                    });
                } else {
                    throw new Error('Kelime bulunamadı. Lütfen yazımını kontrol edin.');
                }
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    error: error.message || 'Kelime aranırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.',
                    isVisible: false
                });
            });
    }

    handleRetry = () => {
        const { word } = this.state;
        if (word) {
            this.getDefinition(word);
        } else {
            const { word: urlWord } = this.props.match.params;
            const wordToSearch = decodeURIComponent(urlWord).toLowerCase();
            this.getDefinition(wordToSearch);
        }
    }

    handleDismissError = () => {
        this.setState({ error: null });
        this.props.history.push('/');
    }

    handleBackToHome = () => {
        this.props.history.push('/');
    }

    render() {
        const { wordData, isFavorited, isLoading, error } = this.state;

        // Show loading spinner
        if (isLoading) {
            return (
                <div className="word-card-container">
                    <LoadingSpinner size="large" message="Kelime aranıyor..." />
                </div>
            );
        }

        // Show error message
        if (error) {
            return (
                <div className="word-card-container">
                    <div className="inner-box">
                        <button className="back-to-home-button" onClick={this.handleBackToHome}>
                            ← Ana Sayfa
                        </button>
                        <ErrorMessage
                            message={error}
                            onRetry={this.handleRetry}
                            onDismiss={this.handleDismissError}
                        />
                    </div>
                </div>
            );
        }

        return (this.state.isVisible &&
            <Animated className="word-card-container" animationIn="fadeIn" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.isVisible}>
                <article className="inner-box" role="main" aria-label={`${this.state.word} kelimesinin tanımı`}>
                    <nav aria-label="Sayfa navigasyonu">
                        <button className="back-to-home-button" onClick={this.handleBackToHome} aria-label="Ana sayfaya dön">
                            ← Ana Sayfa
                        </button>
                    </nav>
                    <header className="title-container">
                        <div className="title-row">
                            <h1 className="word-title">{this.state.word}</h1>
                            <button
                                className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                                onClick={this.toggleFavorite}
                                title={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                                aria-label={isFavorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                                aria-pressed={isFavorited}
                            >
                                {isFavorited ? '★' : '☆'}
                            </button>
                        </div>

                        {/* Etymology Section */}
                        {wordData && wordData.lisan && (
                            <div className="etymology-badge" role="note" aria-label="Etimoloji">
                                <span className="etymology-icon" aria-hidden="true">🌍</span>
                                <span className="etymology-text">{wordData.lisan}</span>
                            </div>
                        )}

                        {/* Pronunciation */}
                        {wordData && wordData.telaffuz && (
                            <div className="pronunciation" role="note" aria-label="Telaffuz">
                                <span className="pronunciation-icon" aria-hidden="true">🔊</span>
                                <span className="pronunciation-text">{wordData.telaffuz}</span>
                            </div>
                        )}
                    </header>

                    {/* Definitions */}
                    <section className="definitions" aria-label="Tanımlar">
                        {this.state.definitions.map((definition, i) => (
                            <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={1500 + i * 100} isVisible={this.state.isVisible} key={i}>
                                <div className="definition-container" role="listitem">
                                    <div className="definition-number" aria-label={`${i + 1}. tanım`}>{i + 1}. </div>
                                    <div className="definition-text">{definition.text} </div>
                                </div>
                            </Animated>
                        ))}
                    </section>

                    {/* Compound Words Section */}
                    {wordData && wordData.birlesikler && (
                        <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={1800} isVisible={this.state.isVisible}>
                            <section className="section-container compound-words-section" aria-labelledby="compound-words-title">
                                <h2 id="compound-words-title" className="section-title">Birleşik Kelimeler</h2>
                                <div className="compound-words" role="list">
                                    {wordData.birlesikler.split(',').map((compound, i) => (
                                        <span className="compound-word-tag" role="listitem" key={i}>{compound.trim()}</span>
                                    ))}
                                </div>
                            </section>
                        </Animated>
                    )}

                    {/* Proverbs Section */}
                    {wordData && wordData.atasozu && wordData.atasozu.length > 0 && (
                        <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={2000} isVisible={this.state.isVisible}>
                            <section className="section-container proverbs-section" aria-labelledby="proverbs-title">
                                <h2 id="proverbs-title" className="section-title">Atasözleri ve Deyimler</h2>
                                <ul className="proverbs-list">
                                    {wordData.atasozu.map((proverb, i) => (
                                        <li className="proverb-item" key={i}>
                                            <div className="proverb-content">
                                                <span className="proverb-bullet" aria-hidden="true">•</span>
                                                <span className="proverb-text">{proverb.madde}</span>
                                            </div>
                                            <div className="action-buttons" role="group" aria-label="Atasözü işlemleri">
                                                <button
                                                    className="action-btn copy-btn"
                                                    onClick={() => this.handleCopy(proverb.madde, `proverb-${i}`)}
                                                    title="Kopyala"
                                                    aria-label={`${proverb.madde} atasözünü kopyala`}
                                                >
                                                    {this.state.copiedItem === `proverb-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
                                                </button>
                                                <button
                                                    className="action-btn share-btn"
                                                    onClick={() => this.handleShare(`"${proverb.madde}"\n\n— Türk Atasözü`)}
                                                    title="Paylaş"
                                                    aria-label={`${proverb.madde} atasözünü paylaş`}
                                                >
                                                    Paylaş
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </Animated>
                    )}

                    {/* Literary Examples Section */}
                    {wordData && wordData.orneklerListe && wordData.orneklerListe.length > 0 && (
                        <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={2200} isVisible={this.state.isVisible}>
                            <section className="section-container examples-section" aria-labelledby="examples-title">
                                <h2 id="examples-title" className="section-title">Edebiyattan Örnekler</h2>
                                <ul className="examples-list">
                                    {wordData.orneklerListe.map((example, i) => {
                                        const authorName = example.yazar && example.yazar.length > 0
                                            ? example.yazar[0].tam_adi
                                            : '';
                                        const fullQuote = `"${example.ornek}"\n\n— ${authorName}`;
                                        return (
                                            <li className="example-item" key={i}>
                                                <div className="example-content">
                                                    <p className="example-text">"{example.ornek}"</p>
                                                    {authorName && (
                                                        <p className="example-author">— {authorName}</p>
                                                    )}
                                                </div>
                                                <div className="action-buttons" role="group" aria-label="Örnek işlemleri">
                                                    <button
                                                        className="action-btn copy-btn"
                                                        onClick={() => this.handleCopy(fullQuote, `example-${i}`)}
                                                        title="Kopyala"
                                                        aria-label={`Örneği kopyala: ${example.ornek.substring(0, 50)}...`}
                                                    >
                                                        {this.state.copiedItem === `example-${i}` ? '✓ Kopyalandı' : 'Kopyala'}
                                                    </button>
                                                    <button
                                                        className="action-btn share-btn"
                                                        onClick={() => this.handleShare(fullQuote)}
                                                        title="Paylaş"
                                                        aria-label={`Örneği paylaş: ${example.ornek.substring(0, 50)}...`}
                                                    >
                                                        Paylaş
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        </Animated>
                    )}
                </article>
            </Animated>
        )
    }

}
