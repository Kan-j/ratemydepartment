"use client"
import Image from "next/image"
import Link from "next/link"


import QuarterSelector from "./QuarterSelector"




const TopBar = () => {


return (
    <nav className="fixed top-0 z-30 flex w-full items-center justify-between  px-6 py-3 bg-white">
        <div className="flex items-center gap-4">
            {/* <Image src="/assets/logo.svg" alt="logo" width={28} height={28} /> */}
            <Link href="/" className="text-gray-500 hover:bg-transparent font-bold text-lg py-2 max-xs:hidden">RateYour<span className="text-white bg-blue-500 px-2 py-2">Department</span></Link>
        </div>

        <section className="flex items-center gap-4">
        
        </section>

        <QuarterSelector screen="big"/>

        <div className="flex items-center gap-1">
            <div className="block md:hidden">
                <div className="flex cursor-pointer">
                    <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
                </div>
            </div>
        </div>
    </nav>
  )
}

export default TopBar

