import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PREMIND — 강의·발표 AI 분석 플랫폼",
  description:
    "청중 집중도와 강사 전달력을 실시간으로 분석해 강의를 개선합니다. 오프라인 강의실부터 온라인 강의까지, PREMIND가 데이터로 보여줍니다.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "PREMIND — 강의·발표 AI 분석 플랫폼",
    description:
      "청중 집중도와 강사 전달력을 실시간으로 분석해 강의를 개선합니다.",
    url: "https://premind.ai",
    siteName: "PREMIND",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "PREMIND 강의 분석 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PREMIND — 강의·발표 AI 분석 플랫폼",
    description:
      "청중 집중도와 강사 전달력을 실시간으로 분석해 강의를 개선합니다.",
    images: ["/og.png"],
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
