import Contact from '../../components/Contact/Contact';
import { sectionConfig } from '../../data/sectionConfig';
import './ContactPage.css';

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

