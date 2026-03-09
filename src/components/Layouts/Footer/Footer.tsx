import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaHome,
  FaFolderOpen,
  FaNewspaper,
  FaCogs,
  FaShieldAlt,
  FaFileAlt,
  FaExternalLinkAlt,
  FaArrowUp,
} from 'react-icons/fa';
import { profileData } from '@/data/profileData';
import { sectionConfig } from '@/data/sectionConfig';
import { footerContent } from '@/data/footerContent';
import { blogPosts } from '@/data/blogData';
import { LogoMark } from '@/components/Layouts/Footer/FooterIcons';
import '@/components/Layouts/Footer/Footer.css';

// -----------------------------------------------------------------------------
// Icons (react-icons)
// -----------------------------------------------------------------------------

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Email: FaEnvelope,
} as const;

const USEFUL_LINK_ICONS = {
  home: FaHome,
  projects: FaFolderOpen,
  blog: FaNewspaper,
  skills: FaCogs,
  contact: FaEnvelope,
} as const;

const LEGAL_ICONS = {
  privacy: FaShieldAlt,
  terms: FaFileAlt,
} as const;

const PROJECT_LINK_ICON = FaExternalLinkAlt;
const BLOG_POST_ICON = FaNewspaper;

// -----------------------------------------------------------------------------
// Social links config (URLs from profileData)
// -----------------------------------------------------------------------------

const SOCIAL_LINKS = [
  { href: profileData.github, label: 'GitHub' as const },
  { href: profileData.linkedin, label: 'LinkedIn' as const },
  { href: `mailto:${profileData.email}`, label: 'Email' as const },
] as const;

// -----------------------------------------------------------------------------
// Subcomponents
// -----------------------------------------------------------------------------

function FooterLogo() {
  return (
    <div className="footer-logo">
      <LogoMark />
      <span>{profileData.name}</span>
    </div>
  );
}

function FooterSocial() {
  return (
    <div className="footer-social" aria-label="Social links">
      {SOCIAL_LINKS.map(({ href, label }) => {
        const Icon = SOCIAL_ICONS[label];
        return (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            aria-label={label}
            className="footer-social-link"
          >
            <Icon className="footer-social-icon" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

function FooterSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="footer-section">
      {title && <h4>{title}</h4>}
      {children}
    </div>
  );
}

function FooterNavList({ children }: { children: React.ReactNode }) {
  return <ul>{children}</ul>;
}

function FooterTopProjects() {
  const { sections, topProjects } = footerContent;
  const projects = profileData.projects ?? [];
  const list = projects.slice(0, topProjects.maxCount);

  if (list.length === 0) return null;

  const Icon = PROJECT_LINK_ICON;
  return (
    <FooterSection title={sections.topProjects}>
      <FooterNavList>
        {list.map((project, index) => (
          <li key={`${project.name}-${index}`}>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-with-icon"
              aria-label={`${project.name} (opens GitHub)`}
            >
              <span className="footer-link-icon-wrap">
                <Icon className="footer-link-icon" aria-hidden />
              </span>
              <span>{project.name}</span>
            </a>
          </li>
        ))}
      </FooterNavList>
    </FooterSection>
  );
}

function FooterRecentPosts() {
  const { sections, recentPosts } = footerContent;
  const sorted = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const list = sorted.slice(0, recentPosts.maxCount);

  if (list.length === 0) return null;

  const Icon = BLOG_POST_ICON;
  return (
    <FooterSection title={sections.recentPosts}>
      <FooterNavList>
            {list.map((post) => (
          <li key={post.id}>
            <Link to={`/blog/${post.id}`} className="footer-link-with-icon" aria-label={post.title}>
              <span className="footer-link-icon-wrap">
                <Icon className="footer-link-icon" aria-hidden />
              </span>
              <span>{post.title}</span>
            </Link>
          </li>
        ))}
      </FooterNavList>
    </FooterSection>
  );
}

function ScrollToTopButton() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="footer-scroll-top"
      aria-label="Scroll to top"
    >
      <FaArrowUp className="footer-scroll-top-icon" aria-hidden />
    </button>
  );
}

function FooterBottom() {
  const year = new Date().getFullYear();
  const { brandName, legalLinks } = footerContent;

  return (
    <div className="footer-bottom">
      <div className="footer-bottom-left">
        <p>Copyright {year} {brandName}</p>
        <p>All Rights Reserved</p>
      </div>
      <nav className="footer-links" aria-label="Legal">
        {legalLinks.map(({ href, label, ariaLabel, iconKey }) => {
          const Icon = LEGAL_ICONS[iconKey];
          return (
            <a key={href} href={href} aria-label={ariaLabel} className="footer-link-with-icon">
              <span className="footer-link-icon-wrap">
                <Icon className="footer-link-icon" aria-hidden />
              </span>
              <span>{label}</span>
            </a>
          );
        })}
      </nav>
      <ScrollToTopButton />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

export default function Footer() {
  const { taglineFallback, sections, usefulLinks } = footerContent;
  const tagline = profileData.about?.[0] ?? taglineFallback;
  const showTopProjects =
    sectionConfig.projects && (profileData.projects?.length ?? 0) > 0;

  const visibleUsefulLinks = usefulLinks.filter(
    (link) => !('sectionKey' in link) || (sectionConfig as Record<string, boolean>)[link.sectionKey]
  );

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <FooterSection>
            <FooterLogo />
            <p className="footer-description">{tagline}</p>
            <FooterSocial />
          </FooterSection>

          <FooterSection title={sections.usefulLinks}>
            <FooterNavList>
              {visibleUsefulLinks.map((link) => {
                const Icon = USEFUL_LINK_ICONS[link.iconKey];
                return (
                  <li key={link.path}>
                    {'isAnchor' in link && link.isAnchor ? (
                      <a href={link.path} className="footer-link-with-icon">
                        <span className="footer-link-icon-wrap">
                          <Icon className="footer-link-icon" aria-hidden />
                        </span>
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link to={link.path} className="footer-link-with-icon">
                        <span className="footer-link-icon-wrap">
                          <Icon className="footer-link-icon" aria-hidden />
                        </span>
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </FooterNavList>
          </FooterSection>

          {showTopProjects && <FooterTopProjects />}

          {sectionConfig.blog && <FooterRecentPosts />}
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
