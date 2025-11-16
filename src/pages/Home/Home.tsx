import Hero from '../../components/Features/Hero/Hero';
import Skills from '../../components/Features/Skills/Skills';
import Experience from '../../components/Features/Experience/Experience';
import Education from '../../components/Features/Education/Education';
import { sectionConfig } from '../../data/sectionConfig';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {sectionConfig.hero && <Hero />}
      {sectionConfig.skills && <Skills />}
      {sectionConfig.experience && <Experience />}
      {sectionConfig.education && <Education />}
    </div>
  );
};

export default Home;

