import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="not-found-number">404</div>
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

