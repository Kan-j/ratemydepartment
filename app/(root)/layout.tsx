import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Image from 'next/image';
import Providers from "@/components/auth/Providers";
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
        <Providers>
          <section className="min-h-screen md:h-screen relative">
          <Image
              src='/assets/safety.png'
              alt="alt"
              className="h-4/5"
              fill
              style={{objectFit:"cover",objectPosition:"center"}}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>
            <section className="relative z-10 h-full">
              <section className="flex justify-center items-center h-full">
                {children}
              </section>
            </section>
            <section className="bg-white h-2/6 absolute bottom-0 w-full">
              <Image src="/assets/vra-logo.jpg" alt="alt" className="absolute bottom-0 left-2" width={200} height={30} />
            </section>
          </section>
          </Providers>
        </body>
    </html>
  );
}
