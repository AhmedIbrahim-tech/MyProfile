import { useState, useEffect } from "react";
import type { Repository } from "@/modules/projects/types";
import { githubService } from "@/modules/projects/services/githubService";

export const useRepositories = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRepos = async () => {
      try {
        const data = await githubService.getUserRepositories();
        if (isMounted) {
          setRepos(data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Failed to fetch repositories");
          setLoading(false);
        }
      }
    };

    fetchRepos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { repos, loading, error };
};
