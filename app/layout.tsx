import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: "전세사기 위험 점검 훈련",
  description:
    "포켓몬스터 골드 컨셉의 전세사기 판별 웹게임. 골목을 돌아다니며 매물 서류를 확인하고 전세사기 위험이 있는 집인지 O·X로 판정하세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
