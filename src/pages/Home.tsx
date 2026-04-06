import Hero from '@/features/Hero';
import Skills from '@/features/Skills';
import Experience from '@/features/Experience';
import Education from '@/features/Education';
import { sectionConfig } from '@/data/sectionConfig';
import '@/assets/styles/pages/Home.css';

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

