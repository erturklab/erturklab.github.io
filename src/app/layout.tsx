import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteNotice } from "@/components/site-notice";
import { ThemeProvider } from "@/components/theme-picker";
import site from "@/content/site.json";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-display-face" });

export const metadata: Metadata = {
  title: { default: site.lab.name, template: `%s | ${site.lab.name}` },
  description: site.lab.mission,
  icons: {
    icon: "/logos/erturk-lab-mark-header.png",
    shortcut: "/logos/erturk-lab-mark-header.png",
    apple: "/logos/erturk-lab-mark-header.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("erturk-lab-theme");var ok=["dark","light","midnight","slate","warm","paper"];if(t&&ok.indexOf(t)>-1){document.documentElement.className=t;}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrument.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <SiteNotice />
        </ThemeProvider>
      </body>
    </html>
  );
}
