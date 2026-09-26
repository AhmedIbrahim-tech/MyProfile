export interface TechnicalDetailsProps {
  architecture: string[];
  features: string[];
  challenges: string[];
  archNumber?: string;
  featNumber?: string;
  chalNumber?: string;
}

export const TechnicalDetails = ({
  architecture,
  features,
  challenges,
  archNumber = '02',
  featNumber = '03',
  chalNumber = '04',
}: TechnicalDetailsProps) => {
  const hasArchitecture = architecture.length > 0;
  const hasFeatures = features.length > 0;
  const hasChallenges = challenges.length > 0;

  if (!hasArchitecture && !hasFeatures && !hasChallenges) {
    return null;
  }

  return (
    <>
      {/* Architecture & Engineering */}
      {hasArchitecture && (
        <section className="case-study-section" aria-labelledby="section-arch-title">
          <div className="case-study-section-header">
            <span className="section-eyebrow">
              {archNumber} — ARCHITECTURE & ENGINEERING
            </span>
            <h2 id="section-arch-title" className="case-study-section-title">
              System Design & Engineering Principles
            </h2>
          </div>
          <div className="case-study-arch-list">
            {architecture.map((item: string, i: number) => (
              <div key={i} className="arch-editorial-row">
                <span className="arch-row-idx">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="arch-row-content">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Features */}
      {hasFeatures && (
        <section className="case-study-section" aria-labelledby="section-features-title">
          <div className="case-study-section-header">
            <span className="section-eyebrow">
              {featNumber} — KEY FEATURES
            </span>
            <h2 id="section-features-title" className="case-study-section-title">
              Core Capabilities & Delivered Scope
            </h2>
          </div>
          <div className="case-study-features-grid">
            {features.map((f: string, i: number) => (
              <div key={i} className="feature-editorial-item">
                <span className="feature-editorial-idx">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="feature-editorial-text">{f}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Engineering Challenges */}
      {hasChallenges && (
        <section className="case-study-section" aria-labelledby="section-challenges-title">
          <div className="case-study-section-header">
            <span className="section-eyebrow">
              {chalNumber} — ENGINEERING CHALLENGES
            </span>
            <h2 id="section-challenges-title" className="case-study-section-title">
              Technical Obstacles & Problem Solving
            </h2>
          </div>
          <div className="case-study-challenges-list">
            {challenges.map((item: string, i: number) => (
              <div key={i} className="challenge-editorial-row">
                <div className="challenge-tag-badge">
                  <span>CHALLENGE {String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="challenge-editorial-text">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default TechnicalDetails;
