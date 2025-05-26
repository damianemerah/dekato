import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import Provider from '@/app/components/Provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/app/styles/globals.css';
import LayoutWrapper from '@/app/components/layout-wrapper';
import { SidebarProvider, SidebarInset } from '@/app/components/ui/sidebar';
import SidebarContent from '@/app/components/sidebar/sidebar-content';
import Header from '@/app/components/header';
import { Toaster } from '@/app/components/ui/sonner';
import AuthSync from '@/app/components/auth-sync';

export const revalidate = 3600;

const roboto = localFont({
  src: [
    {
      path: './fonts/Roboto-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Roboto-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Roboto-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Roboto-ExtraBold.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
});

const oswald = localFont({
  src: [
    {
      path: './fonts/Oswald-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './fonts/Oswald-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Oswald-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Oswald-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Oswald-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Oswald-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-oswald',
  display: 'swap',
});

export const viewport = {
  themeColor: '#212529',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://www.dekato.ng'),
  alternates: {
    canonical: 'https://www.dekato.ng',
  },
  title: {
    default: 'Dekato Outfit | Fashion & Lifestyle',
    template: '%s | Dekato Outfit',
  },
  manifest: '/manifest.json',
  description:
    'Discover the latest fashion trends and lifestyle products at Dekato Outfit. Shop our curated collection of clothing, accessories, and more.',
  keywords: [
    'fashion',
    'clothing',
    'accessories',
    'lifestyle',
    'shopping',
    'streetwear',
    'trendy',
    'designer fashion',
    'casual wear',
    'urban style',
    'online shopping',
    "men's fashion",
    "women's fashion",
    'footwear',
    'style inspiration',
    'lagos fashion',
    'nigeria fashion',
    'lagos',
  ],
  authors: [{ name: 'Dekato Outfit' }],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: process.env.NEXT_PUBLIC_URL || 'https://www.dekato.ng',
    siteName: 'Dekato Outfit',
    title: 'Dekato Outfit | Fashion & Lifestyle',
    description:
      'Discover the latest fashion trends and lifestyle products at Dekato Outfit.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL || 'https://www.dekato.ng'}/assets/images/image5.webp`,
        width: 1200,
        height: 630,
        alt: 'Dekato Outfit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '',
    creator: '',
    images: ['/assets/images/image5.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'UrjQPJjp2T2sssYtTtmOfdsJg36OaSX9gnoFLvfrSfQ',
    yandex: '73aec00878be9a11',
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <html lang="en" className={`${oswald.variable} ${roboto.variable}`}>
      <AntdRegistry>
        <Provider>
          <body className="font-roboto antialiased">
            <AuthSync />
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex min-h-screen w-full flex-col bg-background">
                <Header />
                <div className="mt-[--nav-height] flex w-full flex-1">
                  <SidebarContent />
                  <SidebarInset>
                    <LayoutWrapper>{children}</LayoutWrapper>
                  </SidebarInset>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          </body>
        </Provider>
      </AntdRegistry>
    </html>
  );
}
