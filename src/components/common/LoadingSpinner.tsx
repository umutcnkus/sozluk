import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    message
}) => {
    return (
        <div className={`loading-spinner-container ${size}`} role="status" aria-live="polite">
            <div className="spinner">
                <div className="spinner-circle"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
            <span className="sr-only">Yükleniyor...</span>
        </div>
    );
};
