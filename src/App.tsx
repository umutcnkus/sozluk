import React from 'react';
import './App.css';
import { WordCard } from './components/word-card/WordCard';
import { HashRouter as Router, Route } from "react-router-dom";
import { Search } from './components/search/Search';
import { Favorites } from './components/favorites/Favorites';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/favorites" exact component={Favorites} />
        <Route path="/:word/" exact component={WordCard} />
        <Route path="/" exact component={Search} />
      </Router>
    </div>
  );
}

export default App;
