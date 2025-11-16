import { Link } from 'react-router-dom';
import { profileData } from '../../../data/profileData';
import { sectionConfig } from '../../../data/sectionConfig';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#7C3AED"/>
                <path d="M12 10L20 16L12 22V10Z" fill="white"/>
              </svg>
              <span>Ahmed Ibrahim</span>
            </div>
            <p className="footer-description">
              Full-stack developer building scalable web applications and enterprise systems.
            </p>
            <div className="footer-social">
              <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.475 0 0 4.475 0 10c0 4.425 2.8625 8.1625 6.8375 9.4875.5.0875.6875-.2125.6875-.475 0-.2375-.0125-1.025-.0125-1.8625-2.5125.4625-3.1625-.6125-3.3625-1.175-.1125-.2875-.6-1.175-1.025-1.4125-.35-.1875-.85-.65-.0125-.6625.7875-.0125 1.35.725 1.5375 1.025.9 1.5125 2.3375 1.0875 2.9125.825.0875-.65.35-1.0875.6375-1.3375-2.225-.25-4.55-1.1125-4.55-4.9375 0-1.0875.3875-1.9875 1.025-2.6875-.1-.25-.45-1.275.1-2.65 0 0 .8375-.2625 2.75 1.025A9.4 9.4 0 0110 4.825c.85 0 1.7.1125 2.5.3375 1.9125-1.3 2.75-1.025 2.75-1.025.55 1.375.2 2.4.1 2.65.6375.7 1.025 1.5875 1.025 2.6875 0 3.8375-2.3375 4.6875-4.5625 4.9375.3625.3125.675.9125.675 1.85 0 1.3375-.0125 2.4125-.0125 2.75 0 .2625.1875.575.6875.475A10.017 10.017 0 0020 10c0-5.525-4.475-10-10-10z"/>
                </svg>
              </a>
              <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.04 17.043h-2.962v-4.641c0-1.107-.023-2.531-1.544-2.531-1.544 0-1.78 1.204-1.78 2.449v4.722H7.793V7.5h2.844v1.3h.039c.397-.75 1.364-1.542 2.808-1.542 3.001 0 3.556 1.975 3.556 4.546v5.238zM4.447 6.194c-.954 0-1.72-.772-1.72-1.72 0-.949.766-1.72 1.72-1.72.948 0 1.72.771 1.72 1.72 0 .948-.772 1.72-1.72 1.72zm1.484 10.85h-2.97V7.5h2.97v9.543zM18.521 0H1.476C.66 0 0 .645 0 1.44v17.12C0 19.355.66 20 1.476 20h17.042c.815 0 1.482-.645 1.482-1.44V1.44C20.002.645 19.336 0 18.52 0h.001z"/>
                </svg>
              </a>
              <a href={`mailto:${profileData.email}`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.66667L10 11.6667L17.5 6.66667M3.33333 15.8333H16.6667C17.5833 15.8333 18.3333 15.0833 18.3333 14.1667V5.83333C18.3333 4.91667 17.5833 4.16667 16.6667 4.16667H3.33333C2.41667 4.16667 1.66667 4.91667 1.66667 5.83333V14.1667C1.66667 15.0833 2.41667 15.8333 3.33333 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          {sectionConfig.projects && (
            <div className="footer-section">
              <h4>Top Projects</h4>
              <ul>
                <li><a href="https://github.com/AhmedIbrahim-tech/Ecommerce-App" target="_blank" rel="noopener noreferrer">E-Commerce App</a></li>
                <li><a href="https://github.com/AhmedIbrahim-tech/File-Sharing-App" target="_blank" rel="noopener noreferrer">File Sharing</a></li>
                <li><a href="https://github.com/AhmedIbrahim-tech/Instagram-Platform" target="_blank" rel="noopener noreferrer">Social Media Platform</a></li>
                <li><a href="https://github.com/AhmedIbrahim-tech/Movie-Site" target="_blank" rel="noopener noreferrer">Movie Site</a></li>
              </ul>
            </div>
          )}

          <div className="footer-section">
            <h4>Useful Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              {sectionConfig.projects && (
                <li><Link to="/projects">All Projects</Link></li>
              )}
              {sectionConfig.skills && (
                <li><a href="/#skills">Skills</a></li>
              )}
              {sectionConfig.contact && (
                <li><Link to="/contact">Contact</Link></li>
              )}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright {currentYear} AhmedIbrahim.com</p>
          <p>All Rights Reserved</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

