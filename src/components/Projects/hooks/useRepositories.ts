import { useState, useEffect } from "react";
import axios from "axios";
import type { Repository } from "../types";
import { isRepoHidden } from "../utils/repoFilter";

export const useRepositories = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(
          "https://api.github.com/users/AhmedIbrahim-tech/repos",
          {
            params: {
              sort: "updated",
              per_page: 100,
            },
          }
        );
        // Filter out hidden repositories
        let filteredRepos = response.data.filter(
          (repo: Repository) => !isRepoHidden(repo.name)
        );
        
        // Add homepage URL for MyProfile repo
        filteredRepos = filteredRepos.map((repo: Repository) => {
          const repoName = repo.name.toLowerCase();
          if (repoName === "myprofile" || repoName.includes("my-profile") || repoName.includes("portfolio")) {
            return {
              ...repo,
              homepage: "https://ahmedeprahim.vercel.app/",
            };
          }
          return repo;
        });
        
        setRepos(filteredRepos);
        setLoading(false);
      } catch {
        setError("Failed to fetch repositories");
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  return { repos, loading, error };
};

