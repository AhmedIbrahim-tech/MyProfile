import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import resumePdf from '../../../assets/Ahmed Eprahim Resume.pdf';
import { sectionConfig } from '../../../data/sectionConfig';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <div className="logo-icon">
            <div className="logo-cube"></div>
          </div>
          <span>Ahmed Ibrahim</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav className={`nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMobileMenu}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          {sectionConfig.projects && (
            <Link to="/projects" className={isActive('/projects')} onClick={closeMobileMenu}>
              <span className="nav-icon">💼</span>
              <span>Projects</span>
            </Link>
          )}
          {sectionConfig.blog && (
            <Link to="/blog" className={isActive('/blog')} onClick={closeMobileMenu}>
              <span className="nav-icon"><i className="fas fa-blog"></i></span>
              <span>Blog</span>
            </Link>
          )}
          {sectionConfig.contact && (
            <Link to="/contact" className={isActive('/contact')} onClick={closeMobileMenu}>
              <span className="nav-icon">📧</span>
              <span>Contact</span>
            </Link>
          )}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button className="download-resume-btn" onClick={handleDownloadResume}>
            <span className="nav-icon"><i className="fas fa-download"></i></span>
            <span className="btn-text">Download Resume</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

