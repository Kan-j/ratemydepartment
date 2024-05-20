import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Providers from "@/components/auth/Providers";
import TopBar from "@/components/shared/TopBar";
import LeftSideBar from '@/components/shared/LeftSideBar';
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "RYD | Admin",
  description: "The Admin Page for the Rate Your Department App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession()
  const email = session?.user?.email
  
  const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`)
  const userDetails= await response.json()
  const {isAdmin} = userDetails.user

  if(!isAdmin) redirect('/')

  return (
    <Providers>
    <html lang="en">
      <body className={inter.className}>
        <TopBar/>
          <main className="flex flex-row">
            <LeftSideBar/>
                <section className="flex min-h-screen flex-1 flex-col bg-white">
                    <div className="h-full flex flex-col px-4 pt-28 sm:px-4 2xl:px-32">
                    {children}
                    <ToastContainer />
                    </div>
                </section>
          </main>
        </body>
    </html>
    </Providers>
  );
}
