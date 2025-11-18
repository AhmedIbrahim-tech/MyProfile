import './ScrollDownIndicator.css';

const ScrollDownIndicator = () => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="scroll-down-indicator" onClick={handleScrollDown}>
      <span className="scroll-down-text">SCROLL DOWN</span>
      <div className="mouse-icon">
        <div className="mouse-wheel"></div>
      </div>
    </div>
  );
};

export default ScrollDownIndicator;

