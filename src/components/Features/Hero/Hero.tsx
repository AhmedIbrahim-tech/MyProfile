import { Link } from "react-router-dom";
import { profileData } from "@/data/profileData";
import { sectionConfig } from "@/data/sectionConfig";
import profileImage from "@/assets/IMG_2510.jpg";
import ScrollDownIndicator from "@/components/Features/ScrollDownIndicator/ScrollDownIndicator";
import "@/components/Features/Hero/Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        <div className="hero-logo">
          <div className="logo-circle">
            <img src={profileImage} alt={profileData.name} className="profile-image" />
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">{profileData.name}</h1>
          <h2 className="hero-subtitle">{profileData.title}</h2>
          <ul className="hero-description">
            {profileData.about.map((point, index) => {
              // One key highlight per line to reduce visual noise and improve scanability
              const highlightText = (text: string) => {
                let highlighted = text;
                // Line 1: experience; Line 2: stack; Line 3: company name
                if (index === 0) {
                  highlighted = highlighted.replace(
                    /(3\+ years of experience)/gi,
                    '<span class="highlight">$1</span>'
                  );
                } else if (index === 1) {
                  highlighted = highlighted.replace(
                    /(\.NET Core\s*&\s*React)/gi,
                    '<span class="highlight">$1</span>'
                  );
                } else if (index === 2) {
                  highlighted = highlighted.replace(
                    /(HUED)/gi,
                    '<span class="highlight">$1</span>'
                  );
                }
                return highlighted;
              };

              return (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: highlightText(point) }}
                />
              );
            })}
          </ul>

          <div className="hero-info">
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{profileData.location}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
            </div>
            <div className="info-item">
              <i className="fab fa-github"></i>
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
            <div className="info-item">
              <i className="fab fa-linkedin"></i>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="hero-actions">
            {sectionConfig.projects && (
              <Link to="/projects" className="btn-primary">
                <i className="fas fa-code"></i>
                <span>View Projects</span>
              </Link>
            )}
            {sectionConfig.contact && (
              <Link to="/contact" className="btn-secondary">
                <i className="fas fa-envelope"></i>
                <span>Contact Me</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <ScrollDownIndicator />
    </section>
  );
};

export default Hero;
