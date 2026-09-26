import type { Repository } from "@/modules/projects/types";

export const generateFeatures = (repo: Repository): string[] => {
  // Only surface real topics from GitHub; do not fabricate fake features
  if (repo.topics && repo.topics.length > 0) {
    const ignored = new Set(['dotnet', 'csharp', 'c#', 'react', 'javascript', 'typescript', 'html', 'css', 'portfolio']);
    return repo.topics
      .filter((t) => !ignored.has(t.toLowerCase()))
      .slice(0, 3)
      .map((t) => t.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()));
  }

  return [];
};
