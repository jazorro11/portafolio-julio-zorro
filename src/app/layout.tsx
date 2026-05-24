// Root layout — delegates to [locale]/layout.tsx
// Required by Next.js App Router even with locale-based routing
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
