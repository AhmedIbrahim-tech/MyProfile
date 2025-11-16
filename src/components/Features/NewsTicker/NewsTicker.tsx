import { useEffect, useState } from 'react';
import './NewsTicker.css';

const NewsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const newsItems = [
    { emoji: '🚀', text: 'Full Stack Developer available for new projects' },
    { emoji: '💼', text: 'Open to remote opportunities worldwide' },
    { emoji: '✨', text: 'Specialized in .NET Core and React development' },
    { emoji: '🎯', text: 'Building scalable web applications and enterprise systems' },
    { emoji: '🌟', text: '3+ years of professional experience' },
  ];

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

