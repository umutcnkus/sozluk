import React from 'react';
import './App.css';
import { WordCard } from './components/word-card/WordCard';
import { BrowserRouter as HashRouter, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <HashRouter basename='/sozluk'>
        <Route path="/:word/" exact component={WordCard} />
        <Route path="/" exact component={App} />
      </HashRouter>
    </div>
  );
}

export default App;
