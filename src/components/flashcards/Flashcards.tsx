import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getFavorites } from '../../helpers/StorageHelper';
import { getWordData } from '../../helpers/ApiHelper';
import { WordData } from '../../models/interfaces';
import { LoadingSpinner } from '../common/LoadingSpinner';
import './Flashcards.css';

export interface FlashcardsProps extends RouteComponentProps {}

interface FlashcardData {
    word: string;
    definitions: string[];
}

interface FlashcardsState {
    mode: 'menu' | 'flashcards' | 'quiz';
    cards: FlashcardData[];
    currentIndex: number;
    isFlipped: boolean;
    isLoading: boolean;
    // Quiz mode
    quizAnswers: { [key: number]: boolean | null };
    score: number;
    showResults: boolean;
}

export class Flashcards extends React.Component<FlashcardsProps, FlashcardsState> {
    constructor(props: FlashcardsProps) {
        super(props);
        this.state = {
            mode: 'menu',
            cards: [],
            currentIndex: 0,
            isFlipped: false,
            isLoading: false,
            quizAnswers: {},
            score: 0,
            showResults: false
        };
    }

    componentDidMount() {
        this.loadFlashcards();
    }

    loadFlashcards = async () => {
        this.setState({ isLoading: true });
        const favorites = getFavorites();

        if (favorites.length === 0) {
            this.setState({ isLoading: false });
            return;
        }

        const cardPromises = favorites.map(async (fav) => {
            const wordData = await getWordData(fav.word);
            if (wordData) {
                return {
                    word: wordData.madde,
                    definitions: wordData.anlamlarListe.map(a => a.anlam)
                };
            }
            return null;
        });

        const cards = (await Promise.all(cardPromises)).filter(c => c !== null) as FlashcardData[];
        this.setState({ cards, isLoading: false });
    };

    startFlashcards = () => {
        this.setState({ mode: 'flashcards', currentIndex: 0, isFlipped: false });
    };

    startQuiz = () => {
        this.setState({ mode: 'quiz', currentIndex: 0, quizAnswers: {}, score: 0, showResults: false });
    };

    handleFlip = () => {
        this.setState({ isFlipped: !this.state.isFlipped });
    };

    handleNext = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const { currentIndex, cards } = this.state;
        if (currentIndex < cards.length - 1) {
            this.setState({ currentIndex: currentIndex + 1, isFlipped: false });
        }
    };

    handlePrevious = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const { currentIndex } = this.state;
        if (currentIndex > 0) {
            this.setState({ currentIndex: currentIndex - 1, isFlipped: false });
        }
    };

    handleQuizAnswer = (isCorrect: boolean, index: number) => {
        const { quizAnswers } = this.state;
        const newAnswers = { ...quizAnswers, [index]: isCorrect };
        const newScore = Object.values(newAnswers).filter(v => v === true).length;

        this.setState({ quizAnswers: newAnswers, score: newScore });
    };

    handleBackToMenu = () => {
        this.setState({ mode: 'menu', currentIndex: 0, isFlipped: false });
    };

    handleBackToHome = () => {
        this.props.history.push('/');
    };

    render() {
        const { mode, cards, currentIndex, isFlipped, isLoading, quizAnswers, score, showResults } = this.state;

        if (isLoading) {
            return (
                <div className="flashcards-container">
                    <LoadingSpinner size="large" message="Flashcard'lar yükleniyor..." />
                </div>
            );
        }

        if (cards.length === 0) {
            return (
                <div className="flashcards-container">
                    <div className="empty-flashcards">
                        <h1>Hiç favori kelime yok</h1>
                        <p>Flashcard çalışmak için önce favori kelimeler eklemelisin</p>
                        <button className="btn-primary" onClick={this.handleBackToHome}>
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
            );
        }

        if (mode === 'menu') {
            return (
                <div className="flashcards-container">
                    <div className="flashcards-menu">
                        <button className="back-button" onClick={this.handleBackToHome} aria-label="Ana sayfaya dön">
                            ← Ana Sayfa
                        </button>
                        <h1 className="menu-title">Çalışma Modu Seç</h1>
                        <p className="menu-subtitle">{cards.length} kelime hazır</p>

                        <div className="mode-cards">
                            <div className="mode-card" onClick={this.startFlashcards}>
                                <div className="mode-icon">📇</div>
                                <h2>Flashcards</h2>
                                <p>Kelimeleri tek tek gözden geçir. Kartları çevirip tanımlarını öğren.</p>
                            </div>

                            <div className="mode-card" onClick={this.startQuiz}>
                                <div className="mode-icon">✅</div>
                                <h2>Quiz Modu</h2>
                                <p>Kendini test et! Kelimeleri ne kadar iyi bildiğini göster.</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        const currentCard = cards[currentIndex];

        if (mode === 'flashcards') {
            return (
                <div className="flashcards-container">
                    <div className="flashcards-header">
                        <button className="back-button" onClick={this.handleBackToMenu}>
                            ← Geri
                        </button>
                        <div className="progress">
                            {currentIndex + 1} / {cards.length}
                        </div>
                    </div>

                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={this.handleFlip}>
                        <div className="flashcard-inner">
                            <div className="flashcard-front">
                                <h2>{currentCard.word}</h2>
                                <p className="flip-hint">Tanımı görmek için tıkla</p>
                            </div>
                            <div className="flashcard-back">
                                <ul className="definitions-list">
                                    {currentCard.definitions.map((def, i) => (
                                        <li key={i}>{i + 1}. {def}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flashcards-controls">
                        <button
                            className="btn-control"
                            onClick={this.handlePrevious}
                            disabled={currentIndex === 0}
                        >
                            ← Önceki
                        </button>
                        <button
                            className="btn-control"
                            onClick={this.handleNext}
                            disabled={currentIndex === cards.length - 1}
                        >
                            Sonraki →
                        </button>
                    </div>
                </div>
            );
        }

        // Quiz mode
        if (showResults) {
            const percentage = Math.round((score / cards.length) * 100);
            return (
                <div className="flashcards-container">
                    <div className="quiz-results">
                        <h1>Quiz Tamamlandı!</h1>
                        <div className="score-display">
                            <div className="score-circle">{percentage}%</div>
                            <p className="score-text">{score} / {cards.length} doğru</p>
                        </div>
                        <div className="results-actions">
                            <button className="btn-primary" onClick={this.startQuiz}>
                                Tekrar Dene
                            </button>
                            <button className="btn-secondary" onClick={this.handleBackToMenu}>
                                Ana Menü
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Show all words at once in quiz mode
        const answeredCount = Object.keys(quizAnswers).length;
        const allAnswered = answeredCount === cards.length;

        return (
            <div className="flashcards-container">
                <div className="flashcards-header">
                    <button className="back-button" onClick={this.handleBackToMenu}>
                        ← Geri
                    </button>
                    <div className="quiz-progress">
                        Cevaplanan: {answeredCount} / {cards.length}
                    </div>
                </div>

                <div className="quiz-instructions">
                    <p>Her kelimeyi tanımlarıyla birlikte incele ve bilip bilmediğini işaretle:</p>
                </div>

                <div className="quiz-list">
                    {cards.map((card, index) => {
                        const answered = quizAnswers[index];
                        const hasAnswer = answered !== undefined;

                        return (
                            <div
                                key={index}
                                className={`quiz-list-item ${hasAnswer ? 'answered' : ''} ${hasAnswer && answered ? 'correct' : ''} ${hasAnswer && !answered ? 'incorrect' : ''}`}
                            >
                                <div className="quiz-list-word">
                                    <h3>{card.word}</h3>
                                </div>
                                <div className="quiz-list-definitions">
                                    {card.definitions.map((def, i) => (
                                        <p key={i}>{i + 1}. {def}</p>
                                    ))}
                                </div>
                                {!hasAnswer ? (
                                    <div className="quiz-list-buttons">
                                        <button
                                            className="btn-quiz-item btn-no"
                                            onClick={() => this.handleQuizAnswer(false, index)}
                                        >
                                            Bilmiyorum ✗
                                        </button>
                                        <button
                                            className="btn-quiz-item btn-yes"
                                            onClick={() => this.handleQuizAnswer(true, index)}
                                        >
                                            Biliyorum ✓
                                        </button>
                                    </div>
                                ) : (
                                    <div className="quiz-list-result">
                                        {answered ? '✓ Biliyordum' : '✗ Bilmiyordum'}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {allAnswered && (
                    <div className="quiz-complete-banner">
                        <button className="btn-primary" onClick={() => this.setState({ showResults: true })}>
                            Sonuçları Gör ({score} / {cards.length})
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
