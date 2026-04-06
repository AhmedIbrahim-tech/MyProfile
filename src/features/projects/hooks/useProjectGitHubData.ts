import { useState, useEffect } from "react";
import axios from "axios";
import type { Repository } from "@/features/projects/types";

export interface GitHubRepoDetails extends Repository {
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  license: { name: string } | null;
  pushed_at: string;
  size: number;
  default_branch: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export const useProjectGitHubData = (repoName: string | undefined) => {
  const [githubData, setGithubData] = useState<GitHubRepoDetails | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!repoName) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Repo Details
        const repoResponse = await axios.get(
          `https://api.github.com/repos/AhmedIbrahim-tech/${repoName}`
        );
        setGithubData(repoResponse.data);

        // Fetch Contributors
        try {
          const collabResponse = await axios.get(
            `https://api.github.com/repos/AhmedIbrahim-tech/${repoName}/contributors`
          );
          setContributors(collabResponse.data);
        } catch (collabErr) {
          console.warn("Contributors not accessible or none found");
          setContributors([]);
        }

        // Fetch Languages
        try {
          const langResponse = await axios.get(
            `https://api.github.com/repos/AhmedIbrahim-tech/${repoName}/languages`
          );
          setLanguages(Object.keys(langResponse.data));
        } catch (langErr) {
          console.warn("Languages not found");
          setLanguages([]);
        }

        // Fetch README
        try {
          const readmeResponse = await axios.get(
            `https://api.github.com/repos/AhmedIbrahim-tech/${repoName}/readme`
          );
          // GitHub returns content in Base64
          const decodedReadme = atob(readmeResponse.data.content);
          setReadme(decodedReadme);
        } catch (readmeErr) {
          console.warn("README not found for this repository");
          setReadme(null);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch repository data from GitHub");
        setLoading(false);
      }
    };

    fetchData();
  }, [repoName]);

  return { githubData, readme, contributors, languages, loading, error };
};
