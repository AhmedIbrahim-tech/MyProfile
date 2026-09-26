import type { Repository, TopProject } from '../types';

/**
 * Normalizes an identifier for comparison by removing hyphens, underscores, spaces, and converting to lowercase.
 */
export function normalizeIdentifier(str: string): string {
  return (str || '').toLowerCase().replace(/[-_\s]/g, '');
}

/**
 * Determines whether a given GitHub repository corresponds to one of the curated projects.
 * Compares:
 * 1. Curated project ID vs repository name
 * 2. Curated project name vs repository name
 * 3. Curated project GitHub URL vs repository HTML URL (or trailing slug)
 */
export function isCuratedProject(repo: Repository, curatedProjects: TopProject[]): boolean {
  if (!repo || !repo.name) return false;
  const normRepoName = normalizeIdentifier(repo.name);
  const cleanRepoUrl = (repo.html_url || '').toLowerCase().replace(/\/+$/, '');

  return curatedProjects.some((curated) => {
    // 1. Match curated.id against repo.name
    if (normalizeIdentifier(curated.id) === normRepoName) {
      return true;
    }

    // 2. Match curated.name against repo.name
    if (normalizeIdentifier(curated.name) === normRepoName) {
      return true;
    }

    // 3. Match GitHub URLs
    if (curated.github) {
      const cleanCuratedGithub = curated.github.toLowerCase().replace(/\/+$/, '');
      if (cleanCuratedGithub === cleanRepoUrl) {
        return true;
      }
      const curatedSlug = normalizeIdentifier(cleanCuratedGithub.split('/').pop() || '');
      if (curatedSlug && curatedSlug === normRepoName) {
        return true;
      }
    }

    return false;
  });
}
