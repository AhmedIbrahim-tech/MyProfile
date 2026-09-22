import { httpClient } from '@/shared/services/api/httpClient';
import { siteConfig } from '@/config/siteConfig';
import type {
  Repository,
  GitHubRepoDetails,
  GitHubContributor,
} from '@/modules/projects/types';
import { isRepoHidden } from '@/modules/projects/utils/repoFilter';

const GITHUB_API_BASE = 'https://api.github.com';

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

async function fetchWithCache<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const cacheKey = `${url}?${new URLSearchParams(params as Record<string, string>).toString()}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const response = await httpClient.get<T>(url, {
    params,
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  return response.data;
}

export const githubService = {
  /**
   * Fetches public repositories for the user, filtering hidden repos and mapping URLs.
   */
  getUserRepositories: async (): Promise<Repository[]> => {
    const rawRepos = await fetchWithCache<Repository[]>(
      `${GITHUB_API_BASE}/users/${siteConfig.githubUsername}/repos`,
      {
        sort: 'updated',
        per_page: 100,
      }
    );

    // Filter out hidden repositories
    const filteredRepos = rawRepos.filter((repo) => !isRepoHidden(repo.name));

    // Add homepage URL for MyProfile repo if not specified
    return filteredRepos.map((repo) => {
      const repoName = repo.name.toLowerCase();
      if (
        repoName === 'myprofile' ||
        repoName.includes('my-profile') ||
        repoName.includes('portfolio')
      ) {
        return {
          ...repo,
          homepage: siteConfig.url,
        };
      }
      return repo;
    });
  },

  /**
   * Fetches detailed information for a single repository.
   */
  getRepositoryDetails: async (repoName: string): Promise<GitHubRepoDetails> => {
    return fetchWithCache<GitHubRepoDetails>(
      `${GITHUB_API_BASE}/repos/${siteConfig.githubUsername}/${repoName}`
    );
  },

  /**
   * Fetches contributor list for a repository.
   */
  getContributors: async (repoName: string): Promise<GitHubContributor[]> => {
    try {
      return await fetchWithCache<GitHubContributor[]>(
        `${GITHUB_API_BASE}/repos/${siteConfig.githubUsername}/${repoName}/contributors`
      );
    } catch {
      return [];
    }
  },

  /**
   * Fetches programming languages used in a repository.
   */
  getLanguages: async (repoName: string): Promise<string[]> => {
    try {
      const langData = await fetchWithCache<Record<string, number>>(
        `${GITHUB_API_BASE}/repos/${siteConfig.githubUsername}/${repoName}/languages`
      );
      return Object.keys(langData);
    } catch {
      return [];
    }
  },

  /**
   * Fetches and decodes the README markdown for a repository.
   */
  getReadme: async (repoName: string): Promise<string | null> => {
    try {
      const response = await fetchWithCache<{ content: string }>(
        `${GITHUB_API_BASE}/repos/${siteConfig.githubUsername}/${repoName}/readme`
      );
      // GitHub returns README content in Base64
      return atob(response.content);
    } catch {
      return null;
    }
  },
};

