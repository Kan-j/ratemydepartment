
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Image from 'next/image';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "@/components/shared/NavBar";
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ["latin"] });



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession()
  const email = session?.user?.email
  
  const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`)
  const  userDetails= await response.json()
  const {departmentId} = userDetails.user
  
  return (
    <html lang="en">
      <body className={inter.className}>
          <section className=" flex flex-col min-h-screen md:h-screen relative bg-white">
            <NavBar departmentId={departmentId}/>
            <section className="relative z-10 h-full">
              <section className="flex flex-col justify-center text-gray-800 items-center h-full">
                {children}
              </section>
            </section>
            <section className="bg-white h-2/6 absolute bottom-0 w-full">
              <Image src="/assets/vra-logo.jpg" alt="alt" className="absolute bottom-2 left-3" width={200} height={70} />
            </section>
          </section>
          <ToastContainer />
        </body>
    </html>
  );
}
