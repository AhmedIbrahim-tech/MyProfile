import { useEffect, useMemo } from 'react';
import { profileData } from '@/data/profileData';
import { useProjectGitHubData } from './useProjectGitHubData';
import { parseAdvancedReadme } from '../utils/readmeParser';
import { getProjectCategory, getTopProjectCategory } from '../utils/projectCategory';
import { getProjectImage } from '../constants/projectImages';
import type { ProjectDetails, TeamMember, TopProject } from '../types';

export function useProjectDetails(id: string | undefined) {
  // 1. Authoritative Curated Match (case-insensitive, normalized)
  const normalizedId = (id || '').toLowerCase().replace(/[-_\s]/g, '');

  const caseStudy = useMemo<TopProject | null>(() => {
    if (!normalizedId) return null;
    return (
      (profileData.projects.find(
        (p) =>
          p.id.toLowerCase().replace(/[-_\s]/g, '') === normalizedId ||
          p.name.toLowerCase().replace(/[-_\s]/g, '') === normalizedId
      ) as TopProject) || null
    );
  }, [normalizedId]);

  // Determine repository slug to attempt supplementary GitHub enrichment
  const repoNameToFetch = useMemo(() => {
    if (caseStudy?.github) {
      const slug = caseStudy.github.split('/').pop()?.trim();
      if (slug) return slug;
    }
    return id;
  }, [caseStudy, id]);

  const {
    githubData,
    readme,
    contributors,
    languages,
    loading: githubLoading,
    error: githubError,
  } = useProjectGitHubData(repoNameToFetch);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Parse README cautiously if available
  const readmeSections = useMemo(() => parseAdvancedReadme(readme || ''), [readme]);

  const projectDetails = useMemo<ProjectDetails | null>(() => {
    // Branch A: Curated Project (Authoritative Source of Truth)
    if (caseStudy) {
      const name = caseStudy.name;
      const description = caseStudy.description;
      // Curated description is authoritative; README narrative must not overwrite it
      const finalNarrative = caseStudy.description;
      const category = caseStudy.category || getTopProjectCategory(caseStudy);
      const githubUrl = caseStudy.github || githubData?.html_url;
      const liveDemoUrl = caseStudy.liveDemo || githubData?.homepage;
      const imageUrl = getProjectImage(githubUrl || '', caseStudy.name, description, category);

      // Curated tech stack is primary; do NOT merge noisy languages like Shell / PowerShell
      const techTags = caseStudy.techStack && caseStudy.techStack.length > 0
        ? caseStudy.techStack
        : (githubData?.topics || []);

      // Team logic: Only include curated team members. Do NOT invent team roles for GitHub contributors.
      const teamMembers: TeamMember[] = caseStudy.team || [];

      // Curated case study architecture, features, and challenges take strict precedence.
      // README content must NOT replace or contaminate curated fields.
      const architecture = caseStudy.architecture || [];
      const features = caseStudy.features || [];
      const challenges = caseStudy.challenges || [];
      const metrics: string[] = []; // Do not invent or infer metrics for curated projects

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
        contributors, // Separate repository metadata
        architecture,
        features,
        challenges,
        metrics,
        role: caseStudy.role,
        contribution: caseStudy.contribution,
        purpose: caseStudy.purpose,
        outcome: caseStudy.outcome,
        showGitHub: caseStudy.showGitHub,
      };
    }

    // Branch B: Non-Curated GitHub Repository (Supplementary Project)
    if (githubData) {
      const name = githubData.name?.replace(/-/g, ' ').replace(/_/g, ' ') || 'Project';
      const description = githubData.description || 'No description available for this repository.';
      const finalNarrative = readmeSections.narrative || description;
      const category = getProjectCategory(githubData);
      const githubUrl = githubData.html_url;
      const liveDemoUrl = githubData.homepage;
      const imageUrl = getProjectImage(githubUrl, githubData.name, description, category);

      const techTags = [
        ...(githubData.topics || []),
        ...(languages || []).map((lang) => `Stack: ${lang}`),
      ].filter((v, i, a) => a.indexOf(v) === i);

      // GitHub-only projects: No invented team members or roles
      const teamMembers: TeamMember[] = [];

      // Only show what genuinely exists in README sections safely parsed
      const architecture = readmeSections.architecture || [];
      const features = readmeSections.features || [];
      const challenges = readmeSections.challenges || [];
      const metrics = readmeSections.metrics || [];

      return {
        name,
        description,
        finalNarrative,
        githubUrl,
        liveDemoUrl,
        category,
        imageUrl,
        githubData,
        caseStudy: null,
        techTags,
        teamMembers,
        contributors,
        architecture,
        features,
        challenges,
        metrics,
        showGitHub: githubData.showGitHub,
      };
    }

    return null;
  }, [caseStudy, githubData, contributors, languages, readmeSections]);

  // If curated data is found, GitHub failure is non-fatal and ignored.
  const loading = caseStudy ? false : githubLoading;
  const error = caseStudy
    ? null
    : githubError
      ? githubError
      : (!githubData && !githubLoading ? 'The requested project could not be found on GitHub.' : null);

  return {
    projectDetails,
    loading,
    error,
  };
}

