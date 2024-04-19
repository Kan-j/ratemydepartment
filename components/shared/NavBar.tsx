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
    // <nav className="flex justify-around py-4 ">
    //     <Link href="/" className="text-gray-500 font-bold text-lg">RateYour<span className="text-white bg-blue-500 px-2">Department</span></Link> 
    //     <section className="flex gap-4">
        // <Link href="/" className="font-semibold text-blue-500">Home</Link>
        // <Link href={`/department/${departmentId}`} className="font-semibold text-gray-600">My Department</Link>
    //     </section>
    //     <section className="flex gap-2">
    //     <DropdownMenu>
    //         <DropdownMenuTrigger className="text-gray-600 font-semibold">{session?.user?.name}</DropdownMenuTrigger>
    //         <DropdownMenuContent>
    //         <DropdownMenuLabel>My Account</DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem>
    //         <button onClick={()=>{}} className="text-blue-500 font-semibold">Admin Panel</button>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem>
    //         <button onClick={()=> signOut()} className="text-red-600 font-semibold">Sign Out</button>
    //         </DropdownMenuItem>
    //         </DropdownMenuContent>
    //     </DropdownMenu>
    //     </section>
    // </nav>
    <>
        <div className="navbar">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><Link href="/" className="hover:bg-transparent font-semibold text-blue-500">Home</Link></li>
                    <li><Link href={`/department/${departmentId}`} className="hover:bg-transparent font-semibold text-gray-600">My Department</Link></li>
                    <li><button onClick={() => signOut()} className="text-red-600 font-semibold">Sign Out</button></li>
                </ul>
                </div>
                <Link href="/" className="text-gray-500 hover:bg-transparent btn btn-ghost font-bold text-lg">RateYour<span className="text-white bg-blue-500 px-2">Department</span></Link> 
            </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
            <li>
                <Link href="/" className="font-semibold hover:bg-transparent text-blue-500">Home</Link>
            </li>
            <li>
                <Link href={`/department/${departmentId}`} className="font-semibold hover:bg-transparent text-gray-600">My Department</Link>
            </li>
            </ul>
        </div>
        <div className="md:flex hidden navbar-end">
            <p className="mr-4">
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
            </p>
        
        </div>
        </div>
    </>
  )
}

export default NavBar