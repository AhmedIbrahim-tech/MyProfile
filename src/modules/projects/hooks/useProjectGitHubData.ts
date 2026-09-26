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
      } catch (err: unknown) {
        if (isMounted) {
          const apiErr = err as { status?: number; message?: string };
          let errorMessage = "Unable to connect to GitHub at this time. Please check your network or try again later.";
          if (apiErr?.status === 404) {
            errorMessage = "The requested repository could not be found on GitHub.";
          } else if (apiErr?.status === 403) {
            errorMessage = "GitHub API rate limit exceeded. Please wait a moment or try again later.";
          } else if (apiErr?.message) {
            errorMessage = `GitHub request failed: ${apiErr.message}`;
          }
          setError(errorMessage);
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
