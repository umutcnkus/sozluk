import React from 'react';
import './App.css';
import { WordCard } from './components/word-card/WordCard';
import { HashRouter as Router, Route } from "react-router-dom";
import { Search } from './components/search/Search';
import { Favorites } from './components/favorites/Favorites';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/common/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <ThemeToggle />
        <Router>
          <Route path="/favorites" exact component={Favorites} />
          <Route path="/:word/" exact component={WordCard} />
          <Route path="/" exact component={Search} />
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
