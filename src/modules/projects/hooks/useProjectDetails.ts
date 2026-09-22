import { useState, useEffect, useMemo } from 'react';
import { siteConfig } from '@/config/siteConfig';
import { profileData } from '@/data/profileData';
import { useProjectGitHubData } from './useProjectGitHubData';
import { inferTechnicalDetails } from '../utils/inferTechnicalDetails';
import { parseAdvancedReadme } from '../utils/readmeParser';
import { getProjectCategory } from '../utils/projectCategory';
import { getProjectImage } from '../constants/projectImages';
import type { ProjectDetails, TeamMember, TopProject } from '../types';

export function useProjectDetails(id: string | undefined) {
  const { githubData, readme, contributors, languages, loading, error } = useProjectGitHubData(id);
  const [caseStudy, setCaseStudy] = useState<TopProject | null>(null);

  useEffect(() => {
    // Check for local case study data in profileData
    const foundCaseStudy = profileData.projects.find(p => p.id === id || p.name === id) as TopProject | undefined;
    if (foundCaseStudy) {
      setCaseStudy(foundCaseStudy);
    } else {
      setCaseStudy(null);
    }
    window.scrollTo(0, 0);
  }, [id]);

  const readmeSections = useMemo(() => parseAdvancedReadme(readme || ''), [readme]);
  const inferredData = useMemo(() => inferTechnicalDetails(githubData), [githubData]);

  const projectDetails = useMemo<ProjectDetails | null>(() => {
    if (!githubData) return null;

    // Tech Stack Logic: Merge manual skills, GitHub topics, and categorized languages
    const techTags = [
      ...(caseStudy?.techStack || []),
      ...(githubData.topics || []),
      ...(languages || []).map(lang => `Stack: ${lang}`)
    ].filter((v, i, a) => a.indexOf(v) === i);

    // Variable Assignments
    const name = githubData.name?.replace(/-/g, ' ').replace(/_/g, ' ') || caseStudy?.name || 'Project';
    const description = caseStudy?.description || githubData.description || 'No description available for this repository.';
    const githubUrl = githubData.html_url;
    const liveDemoUrl = caseStudy?.liveDemo || githubData.homepage;
    const category = caseStudy?.category || getProjectCategory(githubData);
    const imageUrl = getProjectImage(githubUrl, githubData.name, description, category);

    // Team Logic: Use GitHub contributors if present and > 1, otherwise default to Ahmed Ibrahim
    const teamMembers: TeamMember[] = (contributors.length > 1)
      ? contributors.map(c => ({
          name: c.login,
          role: c.login === siteConfig.githubUsername ? 'Lead Developer' : 'Contributor'
        }))
      : [{ name: 'Ahmed Ibrahim', role: 'Full Stack Developer' }];

    // Data Merging Strategies: README > profileData > Inferred
    const finalNarrative = readmeSections.narrative || description;

    const architecture = [
      ...(readmeSections.architecture.length > 0 ? readmeSections.architecture : (caseStudy?.architecture || inferredData.architecture))
    ].filter((v, i, a) => a.indexOf(v) === i);

    const features = [
      ...(readmeSections.features.length > 0 ? readmeSections.features : (caseStudy?.features || inferredData.features))
    ].filter((v, i, a) => a.indexOf(v) === i);

    const challenges = [
      ...(readmeSections.challenges.length > 0 ? readmeSections.challenges : (caseStudy?.challenges || []))
    ].filter((v, i, a) => a.indexOf(v) === i);

    const metrics = readmeSections.metrics;

    return {
      name,
      description,
      finalNarrative,
      githubUrl,
      liveDemoUrl,
      category,
      imageUrl,
      githubData,
      caseStudy,
      techTags,
      teamMembers,
      architecture,
      features,
      challenges,
      metrics,
    };
  }, [githubData, caseStudy, languages, contributors, readmeSections, inferredData]);

  return {
    projectDetails,
    loading,
    error,
  };
}
