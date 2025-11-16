import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './NewsTicker.css';

const NewsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const isProjectsPage = location.pathname === '/projects';

  const generalNewsItems = [
    { emoji: '🚀', text: 'Full Stack Developer available for new projects' },
    { emoji: '💼', text: 'Open to remote opportunities worldwide' },
    { emoji: '✨', text: 'Specialized in .NET Core and React development' },
    { emoji: '🎯', text: 'Building scalable web applications and enterprise systems' },
    { emoji: '🌟', text: '3+ years of professional experience' },
    { emoji: '🔐', text: 'Expert in secure authentication and authorization systems' },
    { emoji: '⚡', text: 'Performance optimization and code quality enthusiast' },
    { emoji: '🤝', text: 'Collaborative team player with strong communication skills' },
    { emoji: '📚', text: 'Continuously learning and staying updated with latest technologies' },
    { emoji: '🌐', text: 'Experience with cloud platforms and DevOps practices' },
    { emoji: '🎓', text: 'Strong background in software engineering principles' },
    { emoji: '💡', text: 'Problem solver focused on delivering innovative solutions' },
  ];

  const projectsNewsItems = [
    { emoji: '⭐', text: 'Top Projects showcase featuring E-Commerce Platform' },
    { emoji: '💻', text: 'Full-Stack projects built with .NET and React' },
    { emoji: '🎨', text: 'Modern UI/UX implementations across all projects' },
    { emoji: '🔧', text: 'Enterprise-grade solutions and scalable architectures' },
    { emoji: '📱', text: 'Responsive designs optimized for all devices' },
    { emoji: '🛒', text: 'E-Commerce solutions with payment integration and cart management' },
    { emoji: '🔍', text: 'Advanced search and filtering capabilities in all projects' },
    { emoji: '📊', text: 'Data visualization and analytics features implemented' },
    { emoji: '🔔', text: 'Real-time notifications and updates in applications' },
    { emoji: '🌍', text: 'Multi-language support and internationalization ready' },
    { emoji: '⚙️', text: 'RESTful APIs and microservices architecture patterns' },
    { emoji: '🎭', text: 'State management with Redux, Context API, and custom hooks' },
    { emoji: '🧪', text: 'Comprehensive testing strategies and quality assurance' },
    { emoji: '📦', text: 'Modular code structure and reusable component libraries' },
  ];

  const newsItems = isProjectsPage ? projectsNewsItems : generalNewsItems;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <div className="news-ticker">
      <div className="ticker-label">
        <i className="fas fa-bullhorn"></i>
        <span>Latest News</span>
      </div>
      <div className="ticker-content">
        <div 
          className="ticker-item"
          key={currentIndex}
        >
          <span className="ticker-emoji">{newsItems[currentIndex].emoji}</span>
          <span className="ticker-text">{newsItems[currentIndex].text}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;

