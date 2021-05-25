import React from 'react';
import './App.css';
import { WordCard } from './components/word-card/WordCard';
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Route path="/:word/" exact component={WordCard} />
        <Route path="/" exact component={App} />
      </Router>
    </div>
  );
}

export default App;
