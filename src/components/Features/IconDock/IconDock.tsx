import { useLocation, useNavigate } from 'react-router-dom';
import { profileData } from '../../../data/profileData';
import resumePdf from '../../../assets/Ahmed Eprahim Resume.pdf';
import './IconDock.css';

const IconDock = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
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
    <div className="icon-dock">
      <div className="dock-container">
        <button 
          className={`dock-icon ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => {
            if (location.pathname !== '/') {
              navigate('/');
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          title="Home"
        >
          <i className="fas fa-sun"></i>
        </button>
        
        <button 
          className="dock-icon"
          onClick={handleDownloadResume}
          title="Download CV"
        >
          <i className="fas fa-download"></i>
        </button>
        
        <button 
          className="dock-icon"
          onClick={() => handleSectionClick('experience')}
          title="Experience"
        >
          <i className="fas fa-briefcase"></i>
        </button>
        
        <button 
          className="dock-icon"
          onClick={() => handleSectionClick('skills')}
          title="Skills"
        >
          <i className="fas fa-lightbulb"></i>
        </button>
        
        <button 
          className="dock-icon"
          onClick={() => handleSectionClick('education')}
          title="Education"
        >
          <i className="fas fa-certificate"></i>
        </button>
        
        <button 
          className={`dock-icon ${location.pathname === '/projects' ? 'active' : ''}`}
          onClick={() => {
            if (location.pathname !== '/projects') {
              navigate('/projects');
            }
          }}
          title="Projects"
        >
          <i className="fas fa-code"></i>
        </button>
        
        <button 
          className={`dock-icon ${location.pathname === '/blog' ? 'active' : ''}`}
          onClick={() => {
            if (location.pathname !== '/blog') {
              navigate('/blog');
            }
          }}
          title="Blog"
        >
          <i className="fas fa-blog"></i>
        </button>
        
        <button 
          className={`dock-icon ${location.pathname === '/contact' ? 'active' : ''}`}
          onClick={() => {
            if (location.pathname !== '/contact') {
              navigate('/contact');
            }
          }}
          title="Contact"
        >
          <i className="fas fa-envelope"></i>
        </button>
        
        <a 
          href={profileData.github}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-icon"
          title="GitHub"
        >
          <i className="fab fa-github"></i>
        </a>
        
        <a 
          href={profileData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-icon"
          title="LinkedIn"
        >
          <i className="fab fa-linkedin"></i>
        </a>
        
        <a 
          href={`https://wa.me/${profileData.phone.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-icon"
          title="WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>
    </div>
  );
};

export default IconDock;