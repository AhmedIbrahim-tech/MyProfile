export interface ProjectMetricsProps {
  metrics: string[];
}

export const ProjectMetrics = ({ metrics }: ProjectMetricsProps) => {
  if (metrics.length === 0) return null;

  return (
    <section className="metrics-insight-grid">
      {metrics.map((m: string, i: number) => (
        <div key={i} className="insight-metric-card">
          <i className="fas fa-chart-line"></i>
          <p>{m}</p>
        </div>
      ))}
    </section>
  );
};

export default ProjectMetrics;
