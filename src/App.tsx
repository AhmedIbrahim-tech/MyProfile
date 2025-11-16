import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layouts/Header/Header';
import Footer from './components/Layouts/Footer/Footer';
import IconDock from './components/Features/IconDock/IconDock';
import NewsTicker from './components/Features/NewsTicker/NewsTicker';
import ScrollNavigation from './components/Features/ScrollNavigation/ScrollNavigation';
import Home from './pages/Home/Home';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ContactPage from './pages/ContactPage/ContactPage';
import BlogPage from './pages/BlogPage/BlogPage';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <NewsTicker />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <IconDock />
        <ScrollNavigation />
      </div>
    </Router>
  );
}

export default App;
