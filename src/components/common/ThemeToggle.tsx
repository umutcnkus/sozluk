import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`${theme === 'light' ? 'Karanlık' : 'Aydınlık'} temaya geç`}
            title={`${theme === 'light' ? 'Karanlık' : 'Aydınlık'} tema`}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};
