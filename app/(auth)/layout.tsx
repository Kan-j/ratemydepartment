import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from 'next/image';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rate My Department",
  description: "Here is the rate my department app for VRA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <section className="h-screen relative">
          <Image
              src='/assets/safety.png'
              alt="alt"
              fill
              style={{objectFit:"cover",objectPosition:"center"}}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
            <section className="relative z-10 h-full">
              <section className="flex justify-center items-center h-full text-black">
                {children}
              </section>
            </section>
          </section>
        </body>
    </html>
  );
}
