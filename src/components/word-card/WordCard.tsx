import React from 'react';
import { getDefinition } from '../../helpers/ApiHelper';
import { WordDefinition } from '../../models/interfaces';
import { RouteComponentProps } from 'react-router-dom'
import './WordCard.css';

export interface OnboardingPageRouterProps {
    word: string
}
export interface WordCardProps extends RouteComponentProps<OnboardingPageRouterProps> { }

export interface WordCardState {
    definitions: WordDefinition[];
    word: string;
}

export class WordCard extends React.Component<WordCardProps, WordCardState> {

    constructor(props: WordCardProps) {
        super(props);
        this.state = {
            definitions: [],
            word: ""
        }
    }

    componentDidMount() {
        const { word } = this.props.match.params;
        const wordToSearch = decodeURIComponent(word);
        this.getDefinition(wordToSearch)
    }

    getDefinition(word: string) {
        getDefinition(word).then(
            (data: any) => {
                try {
                    this.setState({
                        definitions: data[0].anlamlarListe.map((anlam: { anlam: any; }) => {
                            return {
                                text: anlam.anlam
                            }
                        }),
                        word: word.toLowerCase()
                    })
                }
                catch {
                    this.setState({ word: "hata" });
                    this.getDefinition("hata")
                }
            }
        )
    }

    render() {
        return (
            <div className="word-card-container">
                <div className="inner-box">
                    <div className="title-container">
                        <h3 className="word-title">{this.state.word}</h3>
                    </div>
                    <div className="definitions">
                        {this.state.definitions.map((definition, i) => (
                            <div className="definition-container">
                                <div className="definition-number">{i + 1}. </div>
                                <div className="definition-text">{definition.text} </div>
                            </div>
                        ))

                        }
                    </div>
                </div>
            </div>
        )
    }

}
