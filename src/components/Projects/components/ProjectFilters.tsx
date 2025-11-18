import { useState } from 'react';
import type { ProjectCategory } from '../types';
import './ProjectFilters.css';

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
    { value: 'all', label: 'All Projects', icon: 'fas fa-th' },
    { value: 'top', label: 'Top Projects', icon: 'fas fa-star' },
    { value: 'frontend', label: 'Frontend', icon: 'fas fa-desktop' },
    { value: 'backend', label: 'Backend', icon: 'fas fa-server' },
    { value: 'fullstack', label: 'Full Stack', icon: 'fas fa-layer-group' },
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
    <div className="project-filters">
      <div className="filters-header">
        <h3 className="filters-title">
          <i className="fas fa-filter"></i>
          Filter Projects
        </h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearAllFilters}>
            <i className="fas fa-times"></i>
            Clear All
          </button>
        )}
      </div>

      <div className="category-filters">
        <div className="filter-group">
          <label className="filter-group-label">
            <i className="fas fa-folder"></i>
            Category
          </label>
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.value}
                className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
                onClick={() => onCategoryChange(category.value)}
              >
                <i className={category.icon}></i>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="technology-filters">
        <div className="filter-group">
          <div className="filter-group-header">
            <label className="filter-group-label">
              <i className="fas fa-tags"></i>
              Technologies
            </label>
            <button
              className={`toggle-tech-btn ${showTechFilters ? 'active' : ''}`}
              onClick={() => setShowTechFilters(!showTechFilters)}
            >
              <i className={`fas fa-chevron-${showTechFilters ? 'up' : 'down'}`}></i>
            </button>
          </div>
          {showTechFilters && (
            <div className="technology-tags">
              {availableTechnologies.length > 0 ? (
                availableTechnologies.map((tech) => (
                  <button
                    key={tech}
                    className={`tech-filter-tag ${selectedTechnologies.includes(tech) ? 'active' : ''}`}
                    onClick={() => toggleTechnology(tech)}
                  >
                    {tech}
                    {selectedTechnologies.includes(tech) && (
                      <i className="fas fa-check"></i>
                    )}
                  </button>
                ))
              ) : (
                <p className="no-tech-message">No technologies available</p>
              )}
            </div>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="active-filters">
          <span className="active-filters-label">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="active-filter-badge">
              {categories.find((c) => c.value === selectedCategory)?.label}
              <button
                onClick={() => onCategoryChange('all')}
                className="remove-filter-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          )}
          {selectedTechnologies.map((tech) => (
            <span key={tech} className="active-filter-badge">
              {tech}
              <button
                onClick={() => toggleTechnology(tech)}
                className="remove-filter-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

