import { Inter } from "next/font/google";
import "@/app/globals.css";
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
  const {departmentId, isAdmin} = userDetails.user
  
  return (
    <html lang="en">
      <body className={inter.className}>
          <section className=" flex flex-col min-h-screen md:min-h-screen relative bg-white">
            <NavBar departmentId={departmentId} isAdmin={isAdmin}/>
            <section className=" z-10 h-full">
              <section className="min-h-screen flex flex-col px-4 pt-2 sm:px-4 2xl:px-32">
                {children}
              </section>
            </section>
          </section>
          <ToastContainer />
        </body>
    </html>
  );
}
