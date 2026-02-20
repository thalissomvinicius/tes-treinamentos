import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T&S Cursos | eSocial na Prática — SST",
  description:
    "Curso completo de eSocial para Técnicos em Segurança do Trabalho. Domine os eventos S-2210, S-2220 e S-2240 com certificado digital.",
  keywords: [
    "eSocial",
    "SST",
    "Segurança do Trabalho",
    "S-2210",
    "S-2220",
    "S-2240",
    "curso",
    "certificado",
  ],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
