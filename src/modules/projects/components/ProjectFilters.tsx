import { useState } from 'react';
import type { ProjectCategory } from '@/modules/projects/types';
import '@/assets/styles/features/projects/components/ProjectFilters.css';

export type FilterCategory = 'all' | 'top' | ProjectCategory;

interface ProjectFiltersProps {
  selectedCategory: FilterCategory;
  selectedTechnologies: string[];
  availableTechnologies: string[];
  onCategoryChange: (category: FilterCategory) => void;
  onTechnologiesChange: (technologies: string[]) => void;
}

export const ProjectFilters = ({
  selectedCategory,
  selectedTechnologies,
  availableTechnologies,
  onCategoryChange,
  onTechnologiesChange,
}: ProjectFiltersProps) => {
  const [showTechFilters, setShowTechFilters] = useState(false);

  const categories: { value: FilterCategory; label: string; icon: string }[] = [
    { value: 'all', label: 'ALL', icon: 'fas fa-th-large' },
    { value: 'top', label: 'PORTFOLIO', icon: 'fas fa-briefcase' },
    { value: 'fullstack', label: 'FULL STACK', icon: 'fas fa-layer-group' },
    { value: 'backend', label: 'BACKEND', icon: 'fas fa-server' },
    { value: 'frontend', label: 'FRONTEND', icon: 'fas fa-desktop' },
  ];

  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      onTechnologiesChange(selectedTechnologies.filter((t) => t !== tech));
    } else {
      onTechnologiesChange([...selectedTechnologies, tech]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange('all');
    onTechnologiesChange([]);
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedTechnologies.length > 0;

  return (
    <nav className="project-filters-toolbar" aria-label="Project Filters">
      <div className="filters-primary-row">
        <div className="category-filters-group" role="group" aria-label="Filter by project type">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={`category-filter-btn ${selectedCategory === category.value ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.value)}
              aria-pressed={selectedCategory === category.value}
            >
              <i className={category.icon} aria-hidden="true"></i>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className="filters-secondary-controls">
          {availableTechnologies.length > 0 && (
            <button
              type="button"
              id="tech-filters-toggle"
              className={`tech-toggle-btn ${showTechFilters ? 'expanded' : ''} ${selectedTechnologies.length > 0 ? 'has-active' : ''}`}
              onClick={() => setShowTechFilters(!showTechFilters)}
              aria-expanded={showTechFilters}
              aria-controls="project-tech-filter-panel"
            >
              <i className="fas fa-tags" aria-hidden="true"></i>
              <span>Technologies</span>
              {selectedTechnologies.length > 0 && (
                <span className="tech-count-badge">{selectedTechnologies.length}</span>
              )}
              <i className={`fas fa-chevron-${showTechFilters ? 'up' : 'down'} toggle-icon`} aria-hidden="true"></i>
            </button>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-action"
              onClick={clearAllFilters}
              aria-label="Clear all active project filters"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {showTechFilters && (
        <div
          id="project-tech-filter-panel"
          className="technology-filter-panel"
          role="region"
          aria-label="Technology tag filters"
        >
          <div className="tech-panel-header">
            <span className="tech-panel-hint">Filter projects by specific technology:</span>
            {selectedTechnologies.length > 0 && (
              <button
                type="button"
                className="clear-tech-only-btn"
                onClick={() => onTechnologiesChange([])}
              >
                Clear tech filters ({selectedTechnologies.length})
              </button>
            )}
          </div>
          <div className="technology-tags-grid">
            {availableTechnologies.map((tech) => {
              const isSelected = selectedTechnologies.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  className={`tech-tag-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => toggleTechnology(tech)}
                  aria-pressed={isSelected}
                >
                  {tech}
                  {isSelected && <i className="fas fa-check check-icon" aria-hidden="true"></i>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

