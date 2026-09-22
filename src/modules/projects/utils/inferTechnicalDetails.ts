import type { InferredTechnicalDetails } from '../types';

/**
 * Smart Technical Inference: Generate accurate tech details when data is sparse
 */
export function inferTechnicalDetails(
  githubData: { language?: string | null; name?: string } | null | undefined
): InferredTechnicalDetails {
  const inferred: InferredTechnicalDetails = { architecture: [], features: [] };
  const primaryLang = githubData?.language?.toLowerCase() || '';
  const nameLower = githubData?.name?.toLowerCase() || '';

  // 1. Infer Architecture
  if (primaryLang === 'c#') {
    inferred.architecture.push('ASP.NET Core Architecture with clean separation of concerns');
    inferred.architecture.push('Entity Framework Core for high-performance data persistence');
    inferred.architecture.push('RESTful API design or MVC pattern for scalable web delivery');
  } else if (primaryLang === 'javascript' || primaryLang === 'typescript') {
    inferred.architecture.push('Component-driven React/Vite architecture for modern UI state management');
    inferred.architecture.push('Modular service layer for efficient API communication');
  }

  // 2. Infer Strategic Features
  if (nameLower.includes('gym') || nameLower.includes('portal')) {
    inferred.features.push('Administrative Resource Management and scheduling');
    inferred.features.push('Member Lifecycle and subscription tracking');
  } else if (nameLower.includes('shop') || nameLower.includes('commerce')) {
    inferred.features.push('Dynamic Product Catalog and inventory syncing');
    inferred.features.push('Secure Checkout and order processing workflows');
  } else if (nameLower.includes('api') || nameLower.includes('service')) {
    inferred.features.push('High-performance Endpoint optimization');
    inferred.features.push('Secure Authentication and data validation layers');
  }

  return inferred;
}
