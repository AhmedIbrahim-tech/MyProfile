import { FaWifi } from 'react-icons/fa';
import '@/assets/styles/pages/OfflinePage.css';

const OfflinePage = () => {
  const handleRetry = () => {
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="offline-page">
      <div className="offline-container">
        <div className="offline-content">
          <div className="offline-icon-wrap" aria-hidden="true">
            <FaWifi className="offline-icon" />
          </div>
          <h1 className="offline-title">No Internet Connection</h1>
          <p className="offline-message">
            It looks like you're offline. Please check your connection and try again.
          </p>
          <div className="offline-actions">
            <button
              type="button"
              className="offline-btn"
              onClick={handleRetry}
              disabled={typeof navigator !== 'undefined' && !navigator.onLine}
            >
              <span>Try again</span>
            </button>
          </div>
          <p className="offline-hint">
            The page will reload automatically when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
