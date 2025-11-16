import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ComingSoon.css';

const STORAGE_KEY = 'comingSoonTargetDate';

const ComingSoon = () => {
  // Get or set target date (1 week from now)
  const targetDate = useMemo(() => {
    const savedDate = localStorage.getItem(STORAGE_KEY);
    
    if (savedDate) {
      const parsedDate = new Date(savedDate);
      // Check if saved date is still in the future
      if (parsedDate.getTime() > new Date().getTime()) {
        return parsedDate;
      }
    }
    
    const date = new Date();
    date.setDate(date.getDate() + 7);
    
    localStorage.setItem(STORAGE_KEY, date.toISOString());
    return date;
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="coming-soon-page">
      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <i className="fas fa-rocket"></i>
          </div>
          <h1 className="coming-soon-title">Coming Soon</h1>
          <p className="coming-soon-message">
            We're working hard to bring you something amazing.
            <br />
            Stay tuned for updates!
          </p>
          
          <div className="countdown-timer">
            <div className="countdown-item">
              <div className="countdown-value">{timeLeft.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>

          <div className="coming-soon-actions">
            <Link to="/" className="coming-soon-btn">
              <i className="fas fa-home"></i>
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

