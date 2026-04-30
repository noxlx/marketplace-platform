import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Iraqi Marketplace',
  description: 'A classified marketplace for listings, search, chat, and local deals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
