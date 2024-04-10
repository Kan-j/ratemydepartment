import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
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
          <section className="min-h-screen md:h-screen relative bg-white">
            <section className="relative z-10 h-full">
              <section className="flex justify-center text-gray-800 items-center h-full">
                {children}
              </section>
            </section>
            <section className="bg-white h-2/6 absolute bottom-0 w-full">
              <Image src="/assets/vra-logo.jpg" alt="alt" className="absolute bottom-0 left-2" width={200} height={70} />
            </section>
          </section>
        </body>
    </html>
  );
}
