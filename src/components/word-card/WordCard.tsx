import React from 'react';
import { Animated } from "react-animated-css";
import { RouteComponentProps } from 'react-router-dom';
import { getDefinition, getWordData } from '../../helpers/ApiHelper';
import { WordDefinition, WordData } from '../../models/interfaces';
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
}

export class WordCard extends React.Component<WordCardProps, WordCardState> {

    constructor(props: WordCardProps) {
        super(props);
        this.state = {
            definitions: [],
            word: "",
            isVisible: false,
            wordData: null
        }
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
        // Use the new API to get full word data
        getWordData(word)
            .then((wordData: WordData | null) => {
                if (wordData) {
                    // Extract definitions from the full data for backward compatibility
                    const definitions = wordData.anlamlarListe.map(anlam => ({
                        text: anlam.anlam
                    }));
                    this.setState({
                        definitions: definitions,
                        word: word,
                        isVisible: true,
                        wordData: wordData
                    });
                } else {
                    throw new Error('Word not found');
                }
            })
            .catch(() => {
                this.getDefinition("hata")
                this.setState({ word: "hata"});
            });
    }

    render() {
        const { wordData } = this.state;

        return (this.state.isVisible &&
            <Animated className="word-card-container" animationIn="fadeIn" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.isVisible}>
                <div className="inner-box">
                    <div className="title-container">
                        <h3 className="word-title">{this.state.word}</h3>

                        {/* Etymology Section */}
                        {wordData && wordData.lisan && (
                            <div className="etymology-badge">
                                <span className="etymology-icon">🌍</span>
                                <span className="etymology-text">{wordData.lisan}</span>
                            </div>
                        )}

                        {/* Pronunciation */}
                        {wordData && wordData.telaffuz && (
                            <div className="pronunciation">
                                <span className="pronunciation-icon">🔊</span>
                                <span className="pronunciation-text">{wordData.telaffuz}</span>
                            </div>
                        )}
                    </div>

                    {/* Definitions */}
                    <div className="definitions">
                        {this.state.definitions.map((definition, i) => (
                            <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={1500 + i * 100} isVisible={this.state.isVisible} key={i}>
                                <div className="definition-container">
                                    <div className="definition-number">{i + 1}. </div>
                                    <div className="definition-text">{definition.text} </div>
                                </div>
                            </Animated>
                        ))}
                    </div>

                    {/* Compound Words Section */}
                    {wordData && wordData.birlesikler && (
                        <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={1800} isVisible={this.state.isVisible}>
                            <div className="section-container compound-words-section">
                                <h4 className="section-title">📚 Birleşik Kelimeler</h4>
                                <div className="compound-words">
                                    {wordData.birlesikler.split(',').map((compound, i) => (
                                        <span className="compound-word-tag" key={i}>{compound.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </Animated>
                    )}

                    {/* Proverbs Section */}
                    {wordData && wordData.atasozu && wordData.atasozu.length > 0 && (
                        <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={2000} isVisible={this.state.isVisible}>
                            <div className="section-container proverbs-section">
                                <h4 className="section-title">💬 Atasözleri ve Deyimler</h4>
                                <div className="proverbs-list">
                                    {wordData.atasozu.map((proverb, i) => (
                                        <div className="proverb-item" key={i}>
                                            <span className="proverb-bullet">•</span>
                                            <span className="proverb-text">{proverb.madde}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Animated>
                    )}

                    {/* Literary Examples Section */}
                    {wordData && wordData.orneklerListe && wordData.orneklerListe.length > 0 && (
                        <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={2200} isVisible={this.state.isVisible}>
                            <div className="section-container examples-section">
                                <h4 className="section-title">📖 Edebiyattan Örnekler</h4>
                                <div className="examples-list">
                                    {wordData.orneklerListe.map((example, i) => (
                                        <div className="example-item" key={i}>
                                            <p className="example-text">"{example.ornek}"</p>
                                            {example.yazar && example.yazar.length > 0 && (
                                                <p className="example-author">— {example.yazar[0].tam_adi}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Animated>
                    )}
                </div>
            </Animated>
        )
    }

}
