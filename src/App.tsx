import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from '@/components/Layouts/Header/Header';
import Footer from '@/components/Layouts/Footer/Footer';
import IconDock from '@/components/Features/IconDock/IconDock';
import NewsTicker from '@/components/Features/NewsTicker/NewsTicker';
import ScrollNavigation from '@/components/Features/ScrollNavigation/ScrollNavigation';
import Home from '@/pages/Home/Home';
import ProjectsPage from '@/pages/ProjectsPage/ProjectsPage';
import ContactPage from '@/pages/ContactPage/ContactPage';
import BlogPage from '@/pages/BlogPage/BlogPage';
import BlogDetailsPage from '@/pages/BlogDetailsPage/BlogDetailsPage';
import ComingSoon from '@/pages/ComingSoon/ComingSoon';
import NotFound from '@/pages/NotFound/NotFound';
import '@/App.css';

const KNOWN_PATHS = ['/', '/projects', '/blog', '/contact', '/coming-soon'];
const isKnownPath = (pathname: string) =>
  KNOWN_PATHS.includes(pathname) || /^\/blog\/\d+$/.test(pathname);

function AppLayout() {
  const { pathname } = useLocation();
  const showShell = isKnownPath(pathname);

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
