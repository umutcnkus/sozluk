import React from 'react';
import { Animated } from "react-animated-css";
import { RouteComponentProps } from 'react-router-dom';
import { getDefinition } from '../../helpers/ApiHelper';
import { WordDefinition } from '../../models/interfaces';
import './WordCard.css';

export interface OnboardingPageRouterProps {
    word: string
}
export interface WordCardProps extends RouteComponentProps<OnboardingPageRouterProps> { }

export interface WordCardState {
    definitions: WordDefinition[];
    word: string;
    isVisible: boolean;
}

export class WordCard extends React.Component<WordCardProps, WordCardState> {

    constructor(props: WordCardProps) {
        super(props);
        this.state = {
            definitions: [],
            word: "",
            isVisible: false
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
        getDefinition(word)
            .then((data: any) => this.setState({ definitions: data, word: word, isVisible: true }))
            .catch(() => {
                this.getDefinition("hata")
                this.setState({ word: "hata"});
            }
            )
    }

    render() {
        return (this.state.isVisible &&
            <Animated className="word-card-container" animationIn="fadeIn" animationOut="fadeOut" animationInDuration={1000} isVisible={this.state.isVisible}>
                <div className="inner-box">
                    <div className="title-container">
                        <h3 className="word-title">{this.state.word}</h3>
                    </div>
                    <div className="definitions">
                        {this.state.definitions.map((definition, i) => (
                            <Animated animationIn="fadeInUp" animationOut="fadeOut" animationInDuration={1500 + i * 100} isVisible={this.state.isVisible}>
                                <div className="definition-container" key={i}>
                                    <div className="definition-number">{i + 1}. </div>
                                    <div className="definition-text">{definition.text} </div>
                                </div>
                            </Animated>
                        ))

                        }
                    </div>
                </div>
            </Animated>
        )
    }

}
