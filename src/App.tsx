import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import { IconDock, NewsTicker, ScrollNavigation } from '@/shared/components/navigation';
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

function AppLayout() {
  return (
    <div className="app">
      <Header />
      <NewsTicker />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <IconDock />
      <ScrollNavigation />
    </div>
  );
}

function App() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <SpeedInsights />
    </Router>
  );
}

export default App;

