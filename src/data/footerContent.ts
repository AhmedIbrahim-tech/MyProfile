/**
 * Footer copy and link configuration.
 * Edit strings and links here to change footer content without touching the component.
 */

export const footerContent = {
  /** Brand name used in copyright (e.g. "AhmedIbrahim.com") */
  brandName: 'AhmedIbrahim.com',

  /** Fallback tagline when profileData.about is empty */
  taglineFallback:
    'Full-stack developer building scalable web applications and enterprise systems.',

  /** Section headings */
  sections: {
    topProjects: 'Top Projects',
    recentPosts: 'Recent Posts',
    usefulLinks: 'Useful Links',
  },

  /** Top Projects block (data comes from profileData.projects) */
  topProjects: {
    maxCount: 4,
  },

  /** Recent blog posts (data comes from blogData.blogPosts) */
  recentPosts: {
    maxCount: 4,
  },

  /** Legal links in the bottom bar */
  legalLinks: [
    { href: '#privacy', label: 'Privacy Policy', ariaLabel: 'Privacy Policy', iconKey: 'privacy' as const },
    { href: '#terms', label: 'Terms of Service', ariaLabel: 'Terms of Service', iconKey: 'terms' as const },
  ] as const,

  /** Static useful link entries (path + label). Visibility is controlled by sectionConfig in the component. */
  usefulLinks: [
    { path: '/', label: 'Home', iconKey: 'home' as const },
    { path: '/projects', label: 'All Projects', sectionKey: 'projects' as const, iconKey: 'projects' as const },
    { path: '/blog', label: 'Blog', sectionKey: 'blog' as const, iconKey: 'blog' as const },
    { path: '/#skills', label: 'Skills', sectionKey: 'skills' as const, isAnchor: true, iconKey: 'skills' as const },
    { path: '/contact', label: 'Contact', sectionKey: 'contact' as const, iconKey: 'contact' as const },
  ] as const,
} as const;
