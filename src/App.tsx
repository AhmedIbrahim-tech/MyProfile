import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import IconDock from '@/features/IconDock';
import NewsTicker from '@/features/NewsTicker';
import ScrollNavigation from '@/features/ScrollNavigation';
import Home from '@/pages/Home';
import ProjectsPage from '@/pages/ProjectsPage';
import ContactPage from '@/pages/ContactPage';
import BlogPage from '@/pages/BlogPage';
import BlogDetailsPage from '@/pages/BlogDetailsPage';
import ComingSoon from '@/pages/ComingSoon';
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import NotFound from '@/pages/NotFound';
import OfflinePage from '@/pages/OfflinePage';
import '@/assets/styles/App.css';

const KNOWN_PATHS = ['/', '/projects', '/blog', '/contact', '/coming-soon'];
const isKnownPath = (pathname: string) =>
  KNOWN_PATHS.includes(pathname) || 
  /^\/blog\/\d+$/.test(pathname) ||
  /^\/projects\/[\w-]+$/.test(pathname);

function AppLayout() {
  const isOnline = useOnlineStatus();
  const { pathname } = useLocation();
  const showShell = isKnownPath(pathname);

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <div className="app">
      {showShell && <Header />}
      {showShell && <NewsTicker />}
      <main className={showShell ? 'main-content' : 'main-content main-content--full'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {showShell && <Footer />}
      {showShell && <IconDock />}
      {showShell && <ScrollNavigation />}
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
