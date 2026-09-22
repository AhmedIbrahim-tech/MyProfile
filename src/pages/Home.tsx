import Hero from '@/modules/profile';
import Skills from '@/modules/skills';
import Experience from '@/modules/experience';
import Education from '@/modules/education';
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

