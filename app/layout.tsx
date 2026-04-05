import FaviconSwitcher from "@/components/favicon-switcher";
import { Footer } from "@/components/footer";
import GoogleAnalytics from "@/components/google-analytics";
import { NavBar } from "@/components/nav-bar";

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Solutions | 안성진",
    template: "%s | Solutions",
  },
  description: "알고리즘 문제 풀이 모음 - 안성진",
  metadataBase: new URL("https://solutions.anveloper.dev"),
  openGraph: {
    title: "Solutions | 안성진",
    description: "알고리즘 문제 풀이 모음",
    url: "https://solutions.anveloper.dev",
    siteName: "Solutions",
    locale: "ko_KR",
    type: "website",
    images: "/og.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solutions | 안성진",
    description: "알고리즘 문제 풀이 모음",
    images: "/og.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      var valid = ['light', 'dark', 'korean', 'terminal'];
      var root = document.documentElement;
      root.classList.remove('light', 'dark', 'korean', 'terminal');
      if (valid.indexOf(theme) !== -1) {
        root.classList.add(theme);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="preload"
          href="/fonts/PretendardVariable-subset.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="shortcut icon" href="/favicon-light.svg" />
        <link rel="icon" href="/favicon-light.svg" />
        <link rel="apple-touch-icon" href="/favicon-light.svg" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <a href="#main-content" className="skip-nav">
          본문으로 건너뛰기
        </a>
        <NavBar />

        <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <FaviconSwitcher />
      </body>
    </html>
  );
};

export default RootLayout;
