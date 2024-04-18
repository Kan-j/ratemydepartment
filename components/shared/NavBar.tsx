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


const NavBar = ({departmentId}:{departmentId: number}) => {
    const {data:session} = useSession();

  return (
    <nav className="flex justify-around py-4 ">
        <Link href="/" className="text-gray-500 font-bold text-lg">RateYour<span className="text-white bg-blue-500 px-2">Department</span></Link> 
        <section className="flex gap-4">
        <Link href="/" className="font-semibold text-blue-500">Home</Link>
        <Link href={`/department/${departmentId}`} className="font-semibold text-gray-600">My Department</Link>
        </section>
        <section className="flex gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger className="text-gray-600 font-semibold">{session?.user?.name}</DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
            <button onClick={()=>{}} className="text-blue-500 font-semibold">Admin Panel</button>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <button onClick={()=> signOut()} className="text-red-600 font-semibold">Sign Out</button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </section>
    </nav>
  )
}

export default NavBar