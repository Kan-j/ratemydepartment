"use client"

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaFolder } from 'react-icons/fa'
import { IoGrid } from 'react-icons/io5';


const LeftSideBar = (
    {departmentId}:{departmentId?:number}
) => {
    const pathname = usePathname()
    let sideBarLinks;
    if(departmentId){
        sideBarLinks = [
            {
                icon: <IoGrid fontSize={22}/>,
                route: "/dashboard",
                label: "Corporate",
              },
              {
                icon: <FaFolder fontSize={22}/>,
                route: `/dashboard/departments/${departmentId}`,
                label: "My Department",
              },
        ]
    }else{
        sideBarLinks = [
            {
                icon: <IoGrid fontSize={22}/>,
                route: "/admin",
                label: "Dashboard",
              },
        ]
    }


  return ( <section className="sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-white pb-5 pt-28 max-md:hidden">
        <div className="flex w-full flex-1 flex-col gap-3 px-6 bg-white">
            {sideBarLinks.map((link)=> {
                // 10 is the length of the baseURl /dashboard
                const isActive = (pathname.includes(link.route) && link.route.length > 10) || pathname === link.route
                return (<Link href={link.route}
                    key={link.label}
                    className={`relative flex justify-start gap-4 rounded-lg p-4 text-gray-900 ${isActive && 'bg-blue-400 text-white svg'}`}>
                        {link.icon}
                        <p className="font-medium max-lg:hidden">
                            {link.label}
                        </p>
                    </Link>
                )
            })}
        </div>

            <div className="mt-10 px-6">
                <button onClick={()=> signOut()} className="flex gap-4 p-4">
                <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
                    <p className="text-gray-900 max-lg:hidden">
                        Logout
                    </p>
                </button>
                
            </div>
        
    </section>
  )
}

export default LeftSideBar