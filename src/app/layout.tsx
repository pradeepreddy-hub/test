import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LocalBoost AI',
  description: 'Generate local business marketing content for WhatsApp, Instagram, and LinkedIn.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
