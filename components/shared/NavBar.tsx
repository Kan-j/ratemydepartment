"use client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { signOut, useSession } from "next-auth/react";
  import Link from "next/link";
import { useRouter } from "next/navigation";
import QuarterSelector from "./QuarterSelector";


const NavBar = ({departmentId, isAdmin}:{departmentId: number, isAdmin: Boolean}) => {
    const {data:session} = useSession();
    const router = useRouter()

  return (
    <>
        <div className="navbar md:px-12 px-6">
            <div className="navbar-start">
                <Link href="/" className="text-gray-500 hover:bg-transparent font-bold text-lg">RateYour<span className="text-white bg-blue-500 px-2">Department</span></Link>
            </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="flex gap-4 px-1">
            <li>
                <Link href="/" className="font-semibold hover:bg-transparent text-blue-500 text-lg">Home</Link>
            </li>
            <li>
                <Link href={`/department/${departmentId}`} className="font-semibold hover:bg-transparent text-gray-600 text-lg">My Department</Link>
            </li>
            </ul>
        </div>
        <div className=" gap-8 navbar-end">
            <QuarterSelector screen='big'/>
            <p className="mr-4">
            <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-600 font-semibold text-sm md:text-lg ">{session?.user?.name}</DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && <DropdownMenuItem>
            <button onClick={()=>{router.push('/admin')}} className="text-blue-500 font-semibold">Admin Panel</button>
            </DropdownMenuItem>}
            <DropdownMenuItem className="lg:hidden">
            <Link href="/" className="font-semibold hover:bg-transparent">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="lg:hidden">
            <Link href={`/department/${departmentId}`} className="font-semibold hover:bg-transparent">My Department</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <button onClick={()=> signOut()} className="text-red-600 font-semibold">Sign Out</button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
            </p>
        
        </div>
        </div>
    </>
  )
}

export default NavBar