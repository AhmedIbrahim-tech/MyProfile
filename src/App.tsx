import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import Header from '@/layouts/Header/Header';
import Footer from '@/layouts/Footer/Footer';
import IconDock from '@/features/IconDock/IconDock';
import NewsTicker from '@/features/NewsTicker/NewsTicker';
import ScrollNavigation from '@/features/ScrollNavigation/ScrollNavigation';
import Home from '@/pages/Home/Home';
import ProjectsPage from '@/pages/ProjectsPage/ProjectsPage';
import ContactPage from '@/pages/ContactPage/ContactPage';
import BlogPage from '@/pages/BlogPage/BlogPage';
import BlogDetailsPage from '@/pages/BlogDetailsPage/BlogDetailsPage';
import ComingSoon from '@/pages/ComingSoon/ComingSoon';
import NotFound from '@/pages/NotFound/NotFound';
import OfflinePage from '@/pages/OfflinePage/OfflinePage';
import '@/App.css';

const KNOWN_PATHS = ['/', '/projects', '/blog', '/contact', '/coming-soon'];
const isKnownPath = (pathname: string) =>
  KNOWN_PATHS.includes(pathname) || /^\/blog\/\d+$/.test(pathname);

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
