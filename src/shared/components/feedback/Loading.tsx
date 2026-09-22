import '@/assets/styles/shared/Loading.css';

export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading = ({
  message = 'Loading…',
  size = 'md',
  className = '',
}: LoadingProps) => {
  return (
    <div
      className={`loading-shared loading-shared--${size} ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <div className="loading-shared__spinner" aria-hidden="true" />
      {message && <p className="loading-shared__message">{message}</p>}
    </div>
  );
};

export default Loading;
