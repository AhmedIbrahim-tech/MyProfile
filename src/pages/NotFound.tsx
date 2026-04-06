import { Link } from 'react-router-dom';
import '@/assets/styles/pages/NotFound.css';
import errorCover from '@/assets/error400-cover.png';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <img
            src={errorCover}
            alt="404 - Page not found"
            className="not-found-illustration"
          />
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-message">
            Oops! The page you're looking for doesn't exist. 
            It might have been moved or deleted.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="not-found-btn">
              <i className="fas fa-home"></i>
              <span>Go Home</span>
            </Link>
            <Link to="/projects" className="not-found-btn secondary">
              <i className="fas fa-briefcase"></i>
              <span>View Projects</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

