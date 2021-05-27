import React from 'react';
import './App.css';
import { WordCard } from './components/word-card/WordCard';
import { HashRouter as Router, Route } from "react-router-dom";
import { Search } from './components/search/Search';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/:word/" exact component={WordCard} />
        <Route path="/" exact component={Search} />
      </Router>
    </div>
  );
}

export default App;
