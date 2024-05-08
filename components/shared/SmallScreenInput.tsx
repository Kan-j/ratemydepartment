"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const SmallScreenInput = () => {

    const [departments, setDepartments] = useState<any>(null);
  
    const handleSearch = async(term: string)=> {
      try {
        const response = await fetch(`/api/search?term=${term}`);
        const departments = await response.json()
        setDepartments(departments);
      } catch (error) {
        console.error(error);
        console.log(error)
      }
      if(!term) setDepartments(null)
    }
  


  return (
    <section className="flex items-center gap-4">
        <label className="input input-bordered flex md:hidden items-center gap-2  w-full bg-white">
            <input 
            type="text" 
            className="grow text-gray-900" 
            placeholder="Search Department ...." 
            onChange={(e) => {
                handleSearch(e.target.value);
            }}/>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="gray" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
        </label>

        <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md overflow-y-auto mt-2 " style={{ maxHeight: '250px' }}>
      {departments !== null && departments.departments.map((department: any, index: number) => {
        return(
        <div
          key={department.id} 
          className="bg-white font-medium text-gray-800 rounded-md px-6 py-2 border-b-2 border-b-gray-100 hover:bg-gray-100"
          style={{ animationDelay: `${index * 100}ms` }}
        >
        <Link href={`/admin/departments/${department.id}`}>{department.name}</Link> 
        </div>
      )})}
    </div>
    </section>
  )
}

export default SmallScreenInput
