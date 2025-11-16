import { Link, useLocation } from 'react-router-dom';
import resumePdf from '../../../assets/Ahmed Eprahim Resume.pdf';
import { sectionConfig } from '../../../data/sectionConfig';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleDownloadResume = () => {
    const link = document.createElement('a');
    link.href = resumePdf;
    link.download = 'Ahmed_Ibrahim_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">
            <div className="logo-cube"></div>
          </div>
          <span>Ahmed Ibrahim</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className={isActive('/')}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          {sectionConfig.projects && (
            <Link to="/projects" className={isActive('/projects')}>
              <span className="nav-icon">💼</span>
              <span>Projects</span>
            </Link>
          )}
          {sectionConfig.blog && (
            <Link to="/blog" className={isActive('/blog')}>
              <span className="nav-icon"><i className="fas fa-blog"></i></span>
              <span>Blog</span>
            </Link>
          )}
          {sectionConfig.contact && (
            <Link to="/contact" className={isActive('/contact')}>
              <span className="nav-icon">📧</span>
              <span>Contact</span>
            </Link>
          )}
        </nav>

        <button className="download-resume-btn" onClick={handleDownloadResume}>
          <span className="nav-icon"><i className="fas fa-download"></i></span>
          <span>Download Resume</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

