import type { ParsedReadmeSections } from '@/modules/projects/types';

/**
 * Checks if a line contains ASCII diagrams, box-drawing characters,
 * raw HTML markup, table formatting, or setup/CLI commands.
 */
function isNoiseLine(line: string): boolean {
  const clean = line.trim();
  if (!clean || clean.length < 5) return true;

  // 1. Box drawing and block characters (Unicode & ASCII tree diagrams)
  if (/[\u2500-\u257F\u2580-\u259F]/.test(clean)) return true;
  if (/[┌┐└┘│─├┤┬┴┼═║╒╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡╢╣╤╥╦╧╨╩╪╫╬]/.test(clean)) return true;
  if (/├──|└──|│\s+├──|│\s+└──/.test(clean)) return true; // Directory tree lines
  if (/^[+|\\/*\s\-:=_~]{4,}$/.test(clean)) return true; // Separator line noise
  if (/^(\+|-{2,}|\/|\\|\||o|\*){2,}/.test(clean) && !clean.startsWith('- ') && !clean.startsWith('* ')) return true;

  // 2. Raw HTML lines or HTML comments
  const textWithoutHtml = clean.replace(/<[^>]*>/g, '').trim();
  if (clean.includes('<') && (!textWithoutHtml || clean.startsWith('<!--'))) return true;

  // 3. Markdown table rows and table dividers
  if (clean.startsWith('|') || clean.endsWith('|') || /^\|?[\s\-:|]+\|?$/.test(clean)) return true;

  // 4. Setup, installation, or CLI commands
  if (
    /^(git\s|cd\s|npm\s|npx\s|dotnet\s|yarn\s|pnpm\s|docker\s|docker-compose|curl\s|wget\s|pip\s|python\s|go\s|cargo\s|make\s|export\s|set\s|sudo\s)/i.test(clean) ||
    /^(\$|>)\s*(git|dotnet|npm|yarn|docker|cd|npx)\b/i.test(clean)
  ) return true;

  // 5. Standalone Markdown images
  if (/^!\[.*?\]\(.*?\)$/.test(clean)) return true;

  return false;
}

/**
 * Conservative README Parser: Extracts Narrative, Architecture, Features,
 * Challenges, and Metrics from repository README markdown without hallucinating
 * or absorbing code fences, box diagrams, or setup commands.
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
  let inCodeFence = false;
  let foundDescription = false;

  lines.forEach((line) => {
    const cleanLine = line.trim();
    if (!cleanLine) return;

    // Track fenced code blocks (``` or ~~~) and skip all enclosed lines
    if (cleanLine.startsWith('```') || cleanLine.startsWith('~~~')) {
      inCodeFence = !inCodeFence;
      return;
    }
    if (inCodeFence) {
      return;
    }

    // 1. Identify Sections by Headers
    if (
      line.match(
        /^#{1,3}\s+(Architecture|System Architecture|Technical Architecture|Tech Stack|System Design)\b/i
      )
    ) {
      currentSection = 'architecture';
      return;
    } else if (
      line.match(
        /^#{1,3}\s+(Features|Key Features|Core Features|Capabilities|Key Capabilities|Modules)\b/i
      )
    ) {
      currentSection = 'features';
      return;
    } else if (
      line.match(
        /^#{1,3}\s+(Engineering Challenges|Technical Challenges|Challenges|Problems & Solutions|Technical Problems|Problems)\b/i
      )
    ) {
      currentSection = 'challenges';
      return;
    } else if (
      line.match(
        /^#{1,3}\s+(Metrics|Results|Benchmarks|Performance)\b/i
      )
    ) {
      currentSection = 'metrics';
      return;
    } else if (line.match(/^#{1,3}\s+/)) {
      // Unclassified headings (e.g. ## Roadmap, ## Database, ## Prerequisites, ## Installation, ## License)
      // reset currentSection to null so their contents are never treated as Architecture or Challenges.
      currentSection = null;
      return;
    }

    // 2. Extract Narrative (only before any section header)
    if (
      !currentSection &&
      !foundDescription &&
      !line.startsWith('#') &&
      !isNoiseLine(cleanLine) &&
      cleanLine.length > 20
    ) {
      sections.narrative += (sections.narrative ? ' ' : '') + cleanLine;
      if (sections.narrative.length > 300) foundDescription = true;
      return;
    }

    // 3. Extract List Items for active section
    if (currentSection) {
      if (isNoiseLine(cleanLine)) return;

      let content = cleanLine;
      if (
        cleanLine.startsWith('- ') ||
        cleanLine.startsWith('* ') ||
        cleanLine.startsWith('+ ') ||
        cleanLine.match(/^\d+\.\s+/)
      ) {
        content = cleanLine.replace(/^[-*+]\s+|\d+\.\s+/, '');
      }

      // Strip formatting and markdown links
      content = content
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/<[^>]*>/g, '')
        .trim();

      if (content.length > 5 && !isNoiseLine(content)) {
        sections[currentSection].push(content);
      }
    }
  });

  // Narrative cleanup
  if (sections.narrative) {
    sections.narrative = sections.narrative
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Strip Markdown images
      .replace(/<[^>]*>?/gm, '') // Strip HTML
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Strip bold
      .replace(/\*([^*]+)\*/g, '$1') // Strip italic
      .replace(/__([^_]+)__/g, '$1') // Strip underscores
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Strip links
      .trim();
  }

  // Final section item sanitization
  (['architecture', 'features', 'challenges', 'metrics'] as const).forEach(
    (key) => {
      sections[key] = sections[key]
        .map((item: string) => item.replace(/!\[[^\]]*\]\([^)]+\)/g, '').trim())
        .filter((item: string) => item.length > 0 && !isNoiseLine(item));
    }
  );

  return sections;
}

