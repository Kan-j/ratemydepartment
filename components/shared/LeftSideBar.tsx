"use client"

import {sidebarLinks} from '@/constants'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LeftSideBar = () => {
    const router = useRouter()
    const pathname = usePathname()


  return ( <section className="sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-white pb-5 pt-28 max-md:hidden">
        <div className="flex w-full flex-1 flex-col gap-3 px-6 bg-white">
            {sidebarLinks.map((link)=> {
                // const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
                const isActive = (pathname.includes(link.route) && link.route.length > 6) || pathname === link.route
                return (<Link href={link.route}
                    key={link.label}
                    className={`relative flex justify-start gap-4 rounded-lg p-4 text-gray-900 ${isActive && ''}`}>
                        <Image src={link.imgURL} alt={link.label} width={24} height={24} />
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