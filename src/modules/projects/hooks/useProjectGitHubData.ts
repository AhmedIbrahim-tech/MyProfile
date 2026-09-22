import { useState, useEffect } from "react";
import type { GitHubRepoDetails, GitHubContributor } from "@/modules/projects/types";
import { githubService } from "@/modules/projects/services/githubService";

export type { GitHubRepoDetails, GitHubContributor };

export const useProjectGitHubData = (repoName: string | undefined) => {
  const [githubData, setGithubData] = useState<GitHubRepoDetails | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoName) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [repoData, collabData, langData, readmeData] = await Promise.all([
          githubService.getRepositoryDetails(repoName),
          githubService.getContributors(repoName),
          githubService.getLanguages(repoName),
          githubService.getReadme(repoName),
        ]);

        if (isMounted) {
          setGithubData(repoData);
          setContributors(collabData);
          setLanguages(langData);
          setReadme(readmeData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch repository data from GitHub");
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [repoName]);

  return { githubData, readme, contributors, languages, loading, error };
};
