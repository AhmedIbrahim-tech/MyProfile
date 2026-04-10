import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import resumePdf from '@/assets/Ahmed Eprahim Resume.pdf';
import { sectionConfig } from '@/data/sectionConfig';
import ThemeToggle from '@/components/ThemeToggle';
import {
  HiOutlineHome,
  HiOutlineCode,
  HiOutlinePencilAlt,
  HiOutlineMail,
  HiOutlineDownload,
} from 'react-icons/hi';
import '@/assets/styles/layouts/Header.css';

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
            <span className="nav-icon"><HiOutlineHome /></span>
            <span>Home</span>
          </Link>
          {sectionConfig.projects && (
            <Link to="/projects" className={isActive('/projects')} onClick={closeMobileMenu}>
              <span className="nav-icon"><HiOutlineCode /></span>
              <span>Projects</span>
            </Link>
          )}
          {sectionConfig.blog && (
            <Link to="/blog" className={isActive('/blog')} onClick={closeMobileMenu}>
              <span className="nav-icon"><HiOutlinePencilAlt /></span>
              <span>Blog</span>
            </Link>
          )}
          {sectionConfig.contact && (
            <Link to="/contact" className={isActive('/contact')} onClick={closeMobileMenu}>
              <span className="nav-icon"><HiOutlineMail /></span>
              <span>Contact</span>
            </Link>
          )}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button className="download-resume-btn" onClick={handleDownloadResume} aria-label="Download resume (PDF)">
            <span className="nav-icon"><HiOutlineDownload /></span>
            <span className="btn-text">Download Resume</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

