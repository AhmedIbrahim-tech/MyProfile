import { hiddenRepos } from "../../../data/hiddenRepos";

export const isRepoHidden = (repoName: string): boolean => {
  const normalizedRepoName = repoName.toLowerCase().replace(/[-_\s]/g, "");
  return hiddenRepos.some(
    (hiddenRepo) =>
      hiddenRepo.toLowerCase().replace(/[-_\s]/g, "") === normalizedRepoName
  );
};

