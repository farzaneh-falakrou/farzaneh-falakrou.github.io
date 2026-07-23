import type { MDXComponents } from "mdx/types";

// Provides custom MDX component map for @next/mdx.
// Phase 3 (CS-01) will extend this with styled heading, paragraph, and em components.
// For now, return empty object to use default HTML elements.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
