import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    onRetry,
    onDismiss
}) => {
    return (
        <div className="error-message-container" role="alert" aria-live="assertive">
            <div className="error-content">
                <div className="error-icon" aria-hidden="true">⚠</div>
                <p className="error-text">{message}</p>
            </div>
            <div className="error-actions">
                {onRetry && (
                    <button
                        className="error-btn retry-btn"
                        onClick={onRetry}
                        aria-label="Tekrar dene"
                    >
                        Tekrar Dene
                    </button>
                )}
                {onDismiss && (
                    <button
                        className="error-btn dismiss-btn"
                        onClick={onDismiss}
                        aria-label="Kapat"
                    >
                        Kapat
                    </button>
                )}
            </div>
        </div>
    );
};
