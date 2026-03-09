import '@/shared/Loading/Loading.css';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Loading = ({ message = 'Loading…', size = 'md', className = '' }: LoadingProps) => {
  return (
    <div className={`loading-shared loading-shared--${size} ${className}`.trim()} role="status" aria-live="polite">
      <div className="loading-shared__spinner" aria-hidden="true" />
      {message && <p className="loading-shared__message">{message}</p>}
    </div>
  );
};

export default Loading;
