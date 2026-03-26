import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PREMIND",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased relative min-h-screen overflow-x-hidden overflow-y-auto bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
