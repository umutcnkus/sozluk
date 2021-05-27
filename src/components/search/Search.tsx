import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getDefinition } from '../../helpers/ApiHelper';
import { WordDefinition } from '../../models/interfaces';
import './Search.css';

export interface OnboardingPageRouterProps {
    word: string
}
export interface SearchProps extends RouteComponentProps<OnboardingPageRouterProps> { }

export interface SearchState {
    definitions: WordDefinition[];
}

export class Search extends React.Component<SearchProps, SearchState> {

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            definitions: []
        }
    }

    componentDidMount() {
        setTimeout(() => {
            getDefinition("hata").then((data) => this.setState({ definitions: data }));
        }, 1000);
    }

    handleKeyDown(e: any) {
        if (e.key == 'Enter') {
            window.location.hash = e?.target.value;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="search-box-container">
                    <input className="search-box" type="text"
                        placeholder="sözcük ara"
                        onKeyDown={(e) => this.handleKeyDown(e)}
                        autoFocus>

                    </input>
                </div>
            </React.Fragment>
        )
    }

}
