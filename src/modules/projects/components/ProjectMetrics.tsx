export interface ProjectMetricsProps {
  metrics: string[];
}

export const ProjectMetrics = ({ metrics }: ProjectMetricsProps) => {
  if (metrics.length === 0) return null;

  return (
    <section className="case-study-section metrics-section" aria-labelledby="section-metrics-title">
      <div className="case-study-section-header">
        <span className="section-eyebrow">VERIFIED METRICS</span>
        <h2 id="section-metrics-title" className="case-study-section-title">
          Performance & Reliability
        </h2>
      </div>
      <div className="case-study-metrics-rows">
        {metrics.map((m: string, i: number) => (
          <div key={i} className="metric-editorial-row">
            <span className="metric-arrow">›</span>
            <p className="metric-editorial-text">{m}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectMetrics;
