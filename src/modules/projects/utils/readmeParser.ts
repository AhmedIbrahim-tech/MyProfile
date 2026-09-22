import type { ParsedReadmeSections } from '@/modules/projects/types';

/**
 * Advanced README Intelligence: Extracting Narrative, Metrics, and Technical Specs
 * from repository README markdown.
 */
export function parseAdvancedReadme(markdown: string): ParsedReadmeSections {
  const sections: ParsedReadmeSections = {
    narrative: '',
    architecture: [],
    features: [],
    challenges: [],
    metrics: [],
  };

  if (!markdown) return sections;

  const lines = markdown.split('\n');
  let currentSection: keyof Omit<ParsedReadmeSections, 'narrative'> | null = null;
  let foundDescription = false;

  lines.forEach((line) => {
    const cleanLine = line.trim();
    if (!cleanLine) return;

    // 1. Identify Sections by Headers
    if (
      line.match(
        /^##?\s+(Architecture|Tech|Structure|Pattern|Design|Built With|System|Development|Back-end|Front-end)/i
      )
    ) {
      currentSection = 'architecture';
      return;
    } else if (
      line.match(
        /^##?\s+(Features|Capabilities|Highlights|Function|Scope|What's Inside|Core Components|Modules)/i
      )
    ) {
      currentSection = 'features';
      return;
    } else if (
      line.match(
        /^##?\s+(Challenges|Issues|Problems|Solutions|Goal|Roadmap|Vision|Future)/i
      )
    ) {
      currentSection = 'challenges';
      return;
    } else if (
      line.match(
        /^##?\s+(Metrics|Stats|Results|Performance|Benchmarks|Scale|Impact)/i
      )
    ) {
      currentSection = 'metrics';
      return;
    } else if (line.startsWith('##')) {
      currentSection = null;
      return;
    }

    // 2. Extract Narrative
    if (
      !currentSection &&
      !foundDescription &&
      !line.startsWith('#') &&
      cleanLine.length > 20
    ) {
      sections.narrative += (sections.narrative ? ' ' : '') + cleanLine;
      if (sections.narrative.length > 300) foundDescription = true;
    }

    // 3. Extract List Items
    if (currentSection) {
      if (
        cleanLine.includes('|-') ||
        cleanLine.startsWith('##') ||
        cleanLine.startsWith('#')
      )
        return;

      let content = cleanLine;
      if (
        cleanLine.startsWith('- ') ||
        cleanLine.startsWith('* ') ||
        cleanLine.match(/^\d+\./)
      ) {
        content = cleanLine.replace(/^[-*]\s+|\d+\.\s+/, '');
      }

      if (content.includes('|')) {
        content = content.replace(/^\||\|$/g, '').replace(/\|/g, ': ').trim();
      }

      content = content
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .trim();

      if (content.length > 5) {
        sections[currentSection].push(content);
      }
    }

    // 4. Auto-detect Metrics
    if (
      !currentSection &&
      (cleanLine.includes('%') ||
        (cleanLine.match(/\d+/) &&
          (cleanLine.includes('users') ||
            cleanLine.includes('speed') ||
            cleanLine.includes('uptime'))))
    ) {
      if (sections.metrics.length < 3) sections.metrics.push(cleanLine);
    }
  });

  if (sections.narrative) {
    sections.narrative = sections.narrative
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Strip Markdown images
      .replace(/<[^>]*>?/gm, '') // Strip HTML
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Strip bold
      .replace(/\*([^*]+)\*/g, '$1') // Strip italic
      .replace(/__([^_]+)__/g, '$1') // Strip underscores
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Strip links but keep text
      .trim();
  }

  // Cleanup list items as well
  (['architecture', 'features', 'challenges', 'metrics'] as const).forEach(
    (key) => {
      sections[key] = sections[key]
        .map((item: string) => item.replace(/!\[[^\]]*\]\([^)]+\)/g, '').trim())
        .filter((item: string) => item.length > 0);
    }
  );

  return sections;
}
