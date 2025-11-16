import { profileData } from "../../../data/profileData";
import { sectionConfig } from "../../../data/sectionConfig";
import profileImage from "../../../assets/IMG_2510.jpg";
import "./Hero.css";

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
          <p className="hero-description">{profileData.about}</p>

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
              <a href="#projects" className="btn-primary">
                <i className="fas fa-code"></i>
                <span>View Projects</span>
              </a>
            )}
            {sectionConfig.contact && (
              <a href="/contact" className="btn-secondary">
                <i className="fas fa-envelope"></i>
                <span>Contact Me</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
