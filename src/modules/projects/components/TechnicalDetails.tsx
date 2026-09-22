export interface TechnicalDetailsProps {
  architecture: string[];
  features: string[];
  challenges: string[];
}

export const TechnicalDetails = ({
  architecture,
  features,
  challenges,
}: TechnicalDetailsProps) => {
  return (
    <div className="dashboard-column primary">
      {architecture.length > 0 && (
        <section className="dashboard-section-card">
          <div className="section-card-header">
            <i className="fas fa-layer-group"></i>
            <h3>Architecture & Design</h3>
          </div>
          <div className="section-card-content">
            {architecture.map((item: string, i: number) => (
              <div key={i} className="technical-point">
                <span className="point-number">0{i + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {features.length > 0 && (
        <section className="dashboard-section-card">
          <div className="section-card-header">
            <i className="fas fa-rocket"></i>
            <h3>Strategic Features</h3>
          </div>
          <div className="features-grid-immersive">
            {features.map((f: string, i: number) => (
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

      {challenges.length > 0 && (
        <section className="dashboard-section-card">
          <div className="section-card-header">
            <i className="fas fa-shield-virus"></i>
            <h3>Engineering Challenges</h3>
          </div>
          <div className="section-card-content">
            {challenges.map((item: string, i: number) => (
              <div key={i} className="technical-point challenge">
                <i className="fas fa-check-circle"></i>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TechnicalDetails;
