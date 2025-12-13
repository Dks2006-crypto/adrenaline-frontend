import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/shared/ClientProviders';
import Header from '@/widgets/layouts/Header';
import Footer from '@/widgets/layouts/Footer';
import ScrollToTopButton from '@/shared/ui/ScrollToTopButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Adrenaline Fitness',
  description: 'Фитнес-клуб нового уровня',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ClientProviders>
          <Header />
          <main className="min-h-screen">{children}</main>
          <ScrollToTopButton/>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}