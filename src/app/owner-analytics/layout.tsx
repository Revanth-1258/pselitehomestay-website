import type { Metadata } from 'next';

// Private tool: keep it out of search results. robots.txt must NOT block this path,
// or Googlebot can never see this noindex.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
