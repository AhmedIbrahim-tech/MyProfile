import Contact from '@/components/Contact';
import { sectionConfig } from '@/data/sectionConfig';
import '@/assets/styles/pages/ContactPage.css';

const ContactPage = () => {
  if (!sectionConfig.contact) {
    return null;
  }

  return (
    <div className="contact-page">
      <Contact />
    </div>
  );
};

export default ContactPage;

