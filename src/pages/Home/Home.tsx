import Hero from '@/features/Hero/Hero';
import Skills from '@/features/Skills/Skills';
import Experience from '@/features/Experience/Experience';
import Education from '@/features/Education/Education';
import { sectionConfig } from '@/data/sectionConfig';
import '@/pages/Home/Home.css';

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

