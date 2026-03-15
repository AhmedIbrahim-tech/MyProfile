import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { profileData } from '@/data/profileData';
import { useProjectGitHubData } from '@/components/Projects/hooks/useProjectGitHubData';
import { getProjectImage } from '@/components/Projects/constants/projectImages';
import { getProjectCategory } from '@/components/Projects/utils/projectCategory';
import Loading from '@/shared/Loading';
import '@/pages/ProjectDetailsPage/ProjectDetailsPage.css';

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  // Fetch live data from GitHub
  const { githubData, readme, contributors, languages, loading: githubLoading, error } = useProjectGitHubData(id);
  const [caseStudy, setCaseStudy] = useState<any>(null);

  useEffect(() => {
    // Check for local case study data in profileData
    const foundCaseStudy = profileData.projects.find(p => p.id === id || p.name === id);
    if (foundCaseStudy) {
      setCaseStudy(foundCaseStudy);
    }
    window.scrollTo(0, 0);
  }, [id]);

  // Advanced README Intelligence: Extracting Narrative, Metrics, and Technical Specs
  const parseAdvancedReadme = (markdown: string) => {
    const sections: any = { narrative: '', architecture: [], features: [], challenges: [], metrics: [] };
    if (!markdown) return sections;

    const lines = markdown.split('\n');
    let currentSection: string | null = null;
    let foundDescription = false;

    lines.forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // 1. Identify Sections by Headers
      if (line.match(/^##?\s+(Architecture|Tech|Structure|Pattern|Design|Built With|System|Development|Back-end|Front-end)/i)) {
        currentSection = 'architecture';
        return; 
      } else if (line.match(/^##?\s+(Features|Capabilities|Highlights|Function|Scope|What's Inside|Core Components|Modules)/i)) {
        currentSection = 'features';
        return; 
      } else if (line.match(/^##?\s+(Challenges|Issues|Problems|Solutions|Goal|Roadmap|Vision|Future)/i)) {
        currentSection = 'challenges';
        return; 
      } else if (line.match(/^##?\s+(Metrics|Stats|Results|Performance|Benchmarks|Scale|Impact)/i)) {
        currentSection = 'metrics';
        return; 
      } else if (line.startsWith('##')) {
        currentSection = null;
        return;
      }

      // 2. Extract Narrative
      if (!currentSection && !foundDescription && !line.startsWith('#') && cleanLine.length > 20) {
        sections.narrative += (sections.narrative ? ' ' : '') + cleanLine;
        if (sections.narrative.length > 300) foundDescription = true;
      }

      // 3. Extract List Items
      if (currentSection) {
        if (cleanLine.includes('|-') || cleanLine.startsWith('##') || cleanLine.startsWith('#')) return;

        let content = cleanLine;
        if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ') || cleanLine.match(/^\d+\./)) {
          content = cleanLine.replace(/^[-*]\s+|\d+\.\s+/, '');
        } 

        if (content.includes('|')) {
          content = content.replace(/^\||\|$/g, '').replace(/\|/g, ': ').trim();
        }

        content = content.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').trim();

        if (content.length > 5) {
          sections[currentSection].push(content);
        }
      }

      // 4. Auto-detect Metrics
      if (!currentSection && (cleanLine.includes('%') || (cleanLine.match(/\d+/) && (cleanLine.includes('users') || cleanLine.includes('speed') || cleanLine.includes('uptime'))))) {
        if (sections.metrics.length < 3) sections.metrics.push(cleanLine);
      }
    });

    if (sections.narrative) {
      sections.narrative = sections.narrative
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Strip Markdown images
        .replace(/<[^>]*>?/gm, '') // Strip HTML
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Strip bold
        .replace(/\*([^*]+)\*/g, '$1') // Strip italic
        .replace(/__([^_]+)__/g, '$1') // Strip underscores
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Strip links but keep text
        .trim();
    }
    
    // Cleanup list items as well
    ['architecture', 'features', 'challenges', 'metrics'].forEach(key => {
      sections[key] = sections[key].map((item: string) => 
        item.replace(/!\[[^\]]*\]\([^)]+\)/g, '').trim()
      ).filter((item: string) => item.length > 0);
    });

    return sections;
  };

  const readmeSections = useMemo(() => parseAdvancedReadme(readme || ''), [readme]);

  // Smart Technical Inference: Generate accurate tech details when data is sparse
  const inferTechnicalDetails = () => {
    const inferred: any = { architecture: [], features: [] };
    const primaryLang = githubData?.language?.toLowerCase() || "";
    const nameLower = githubData?.name?.toLowerCase() || "";

    // 1. Infer Architecture
    if (primaryLang === "c#") {
      inferred.architecture.push("ASP.NET Core Architecture with clean separation of concerns");
      inferred.architecture.push("Entity Framework Core for high-performance data persistence");
      inferred.architecture.push("RESTful API design or MVC pattern for scalable web delivery");
    } else if (primaryLang === "javascript" || primaryLang === "typescript") {
      inferred.architecture.push("Component-driven React/Vite architecture for modern UI state management");
      inferred.architecture.push("Modular service layer for efficient API communication");
    }

    // 2. Infer Strategic Features
    if (nameLower.includes("gym") || nameLower.includes("portal")) {
      inferred.features.push("Administrative Resource Management and scheduling");
      inferred.features.push("Member Lifecycle and subscription tracking");
    } else if (nameLower.includes("shop") || nameLower.includes("commerce")) {
      inferred.features.push("Dynamic Product Catalog and inventory syncing");
      inferred.features.push("Secure Checkout and order processing workflows");
    } else if (nameLower.includes("api") || nameLower.includes("service")) {
      inferred.features.push("High-performance Endpoint optimization");
      inferred.features.push("Secure Authentication and data validation layers");
    }

    return inferred;
  };

  const inferredData = useMemo(() => inferTechnicalDetails(), [githubData]);

  // Guard Clauses for early returns
  if (githubLoading) {
    return <Loading message="Initialising Technical Dashboard..." size="lg" />;
  }

  if (error || !githubData) {
    return (
      <div className="project-details-not-found">
        <h2>Project Not Found</h2>
        <p>{error || "The project you are looking for does not exist on GitHub."}</p>
        <Link to="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

  // Tech Stack Logic: Merge manual skills, GitHub topics, and categorized languages
  const techTags = [
    ...(caseStudy?.techStack || []),
    ...(githubData?.topics || []),
    ...(languages || []).map(lang => `Stack: ${lang}`)
  ].filter((v, i, a) => a.indexOf(v) === i);

  // Variable Assignments
  const name = githubData?.name?.replace(/-/g, ' ').replace(/_/g, ' ') || caseStudy?.name || 'Project';
  const description = caseStudy?.description || githubData?.description || "No description available for this repository.";
  const githubUrl = githubData?.html_url;
  const liveDemoUrl = caseStudy?.liveDemo || githubData?.homepage;
  const category = caseStudy?.category || getProjectCategory(githubData);
  const imageUrl = getProjectImage(githubUrl, githubData?.name, description, category);

  // Team Logic: Use GitHub contributors if present and > 1, otherwise default to Ahmed Ibrahim
  const teamMembers = (contributors.length > 1) 
    ? contributors.map(c => ({ name: c.login, role: c.login === 'AhmedIbrahim-tech' ? 'Lead Developer' : 'Contributor' }))
    : [{ name: "Ahmed Ibrahim", role: "Full Stack Developer" }];

  // Data Merging Strategies: README > profileData > Inferred
  const finalNarrative = readmeSections.narrative || description;
  
  const finalArchitecture = [
    ...(readmeSections.architecture.length > 0 ? readmeSections.architecture : (caseStudy?.architecture || inferredData.architecture))
  ].filter((v, i, a) => a.indexOf(v) === i);

  const finalFeatures = [
    ...(readmeSections.features.length > 0 ? readmeSections.features : (caseStudy?.features || inferredData.features))
  ].filter((v, i, a) => a.indexOf(v) === i);

  const finalChallenges = [
    ...(readmeSections.challenges.length > 0 ? readmeSections.challenges : (caseStudy?.challenges || []))
  ].filter((v, i, a) => a.indexOf(v) === i);

  const finalMetrics = readmeSections.metrics;

  return (
    <div className="project-details-page premium-theme">
      <div className="project-details-container">
        {/* Navigation & Live Signal */}
        <div className="premium-nav-strip">
          <Link to="/projects" className="back-btn-minimal">
            <i className="fas fa-arrow-left"></i>
            <span>Back to Forge</span>
          </Link>
          <div className="live-status-pill">
            <span className="pulse-dot"></span>
            <span>Technical Insights Live</span>
          </div>
        </div>

        {/* Hero Section - Split Layout */}
        <section className="project-hero-split">
          <div className="hero-content-meta">
            <div className="project-brand">
              <span className="badge-tag-main">{caseStudy?.category || 'FullStack'}</span>
              <span className="repo-name-mini">ahmedibrahim-tech / {githubData?.name}</span>
            </div>
            <h1 className="project-title-xl">{name}</h1>
            <p className="project-description-lg">{finalNarrative}</p>
            
            <div className="hero-cta-group">
              {liveDemoUrl && (
                <a href={liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn-glow-primary">
                  <span>Live Project</span>
                  <i className="fas fa-external-link-alt"></i>
                </a>
              )}
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-premium">
                <i className="fab fa-github"></i>
                <span>View Source</span>
              </a>
            </div>
          </div>

          <div className="hero-visual-dashboard">
            <div className="immersive-image-wrapper">
              <img src={imageUrl} alt={name} className="main-project-visual" />
              <div className="visual-overlay-glow"></div>
            </div>
            
            {/* Floating Glass Cards */}
            <div className="floating-meta-card tech-card">
              <i className="fas fa-terminal"></i>
              <div className="meta-content">
                <span className="meta-value">
                  {githubData?.language?.toLowerCase() === 'c#' || techTags.some(t => t.toLowerCase().includes('.net')) 
                    ? '.NET Core' 
                    : (githubData?.language || 'Mixed')}
                </span>
                <span className="meta-label">Primary Stack</span>
              </div>
            </div>

            <div className="floating-meta-card stats-card">
              <div className="mini-stat">
                <i className="fas fa-star"></i>
                <span>{githubData?.stargazers_count}</span>
              </div>
              <div className="mini-stat">
                <i className="fas fa-code-branch"></i>
                <span>{githubData?.forks_count}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Dashboard Body */}
        <div className="dashboard-body">
          
          {/* Tech Stack Horizontal Dashboard */}
          <section className="tech-dashboard-bar">
            <div className="bar-label">Infrastructure & Stack</div>
            <div className="tech-scroller">
              {techTags.map((tag: string, i: number) => {
                const parts = tag.split(': ');
                return (
                  <div key={i} className="tech-badge-premium">
                    {parts.length > 1 ? (
                      <>
                        <span className="badge-label">{parts[0]}</span>
                        <span className="badge-value">{parts[1]}</span>
                      </>
                    ) : (
                      tag
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* New Metrics Dashboard (if available) */}
          {finalMetrics.length > 0 && (
            <section className="metrics-insight-grid">
              {finalMetrics.map((m: string, i: number) => (
                <div key={i} className="insight-metric-card">
                  <i className="fas fa-chart-line"></i>
                  <p>{m}</p>
                </div>
              ))}
            </section>
          )}

          <div className="main-dashboard-grid">
            {/* Column 1: Technical Deep Dive */}
            <div className="dashboard-column primary">
              {finalArchitecture.length > 0 && (
                <section className="dashboard-section-card">
                  <div className="section-card-header">
                    <i className="fas fa-layer-group"></i>
                    <h3>Architecture & Design</h3>
                  </div>
                  <div className="section-card-content">
                    {finalArchitecture.map((item: string, i: number) => (
                      <div key={i} className="technical-point">
                        <span className="point-number">0{i + 1}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {finalFeatures.length > 0 && (
                <section className="dashboard-section-card">
                  <div className="section-card-header">
                    <i className="fas fa-rocket"></i>
                    <h3>Strategic Features</h3>
                  </div>
                  <div className="features-grid-immersive">
                    {finalFeatures.map((f: string, i: number) => (
                      <div key={i} className="feature-card-premium">
                        <div className="feature-card-icon">
                          <i className="fas fa-star"></i>
                        </div>
                        <p>{f}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {finalChallenges.length > 0 && (
                <section className="dashboard-section-card">
                  <div className="section-card-header">
                    <i className="fas fa-shield-virus"></i>
                    <h3>Engineering Challenges</h3>
                  </div>
                  <div className="section-card-content">
                    {finalChallenges.map((item: string, i: number) => (
                      <div key={i} className="technical-point challenge">
                        <i className="fas fa-check-circle"></i>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Column 2: Insights & Roles */}
            <div className="dashboard-column sidebar">
              {teamMembers.length > 1 && (caseStudy?.role || caseStudy?.contribution) && (
                <section className="dashboard-section-card compact">
                  <div className="section-card-header">
                    <i className="fas fa-user-circle"></i>
                    <h3>My Contribution</h3>
                  </div>
                  <div className="role-showcase">
                    <span className="role-title">{caseStudy?.role || "Lead Developer"}</span>
                    {caseStudy?.contribution && <p className="role-description">{caseStudy.contribution}</p>}
                  </div>
                </section>
              )}

              <section className="dashboard-section-card compact">
                <div className="section-card-header">
                  <i className="fas fa-users"></i>
                  <h3>Development Team</h3>
                </div>
                <div className="team-vertical-list">
                  {teamMembers.map((member: any, i: number) => (
                    <div key={i} className="team-member-item">
                      <div className="member-avatar">{member.name[0]}</div>
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className="member-role">{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Outcome Footer Banner */}
          {caseStudy?.outcome && (
            <footer className="outcome-premium-footer">
              <div className="outcome-inner">
                <div className="outcome-icon-large">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="outcome-text-group">
                  <h4>Delivery & Impact</h4>
                  <p>{caseStudy.outcome}</p>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
