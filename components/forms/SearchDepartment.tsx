"use client"

import { useState } from "react";
import Link from "next/link";
import RatingForm from "./RatingForm";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Bounce, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const SearchDepartment = ({mydepartmentId}:{mydepartmentId:number}) => {
  const [departments, setDepartments] = useState<any>(null);
  
  const {data:session} = useSession()
  
  const email = session?.user?.email

  const handleSearch = async(term: string)=> {
    
    try {
      const response = await fetch(`/api/search?term=${term}`);
      const departments = await response.json()
      setDepartments(departments);
    } catch (error) {
      console.error(error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
    if(!term) setDepartments(null)
  }


return (
  <div className="w-96 mt-4 flex flex-col relative">
    <label className="input input-bordered flex items-center gap-2 w-96 bg-white">
      <input 
      type="text" 
      className="grow text-gray-900" 
      placeholder="Search Department ...." 
      onChange={(e) => {
        handleSearch(e.target.value);
      }}/>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="gray" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
    </label>

    {/* <div className="absolute flex flex-col gap-2 mt-4">
      {departments !== null  && departments.departments.map((department:any) => {
        return (
            <Link href={`/department/${department.id}`} key={department.id} className="bg-white font-medium text-gray-800 p-2 rounded-md ">
              {department.name}
            </Link>
          
        )
      })}
    </div> */}

     <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-md overflow-y-auto mt-2 " style={{ maxHeight: '250px' }}>
    {departments !== null && departments.departments.map((department: any, index: number) => {
      if(department.id === mydepartmentId) return (
        <div
        key={department.id} 
        className="bg-white font-medium text-gray-800 rounded-md px-6 py-2 border-b-2 border-b-gray-100 hover:bg-gray-100"
        style={{ animationDelay: `${index * 100}ms` }}
      >
          <button className="w-full text-left" onClick={()=> {toast(`Can't rate your own department`,{
             position: 'top-center',
             autoClose: 5000,
             theme: "light",
             transition: Bounce,
             type: "error",
             draggable:"mouse",
            className: "w-fit"

          })}}>{department.name}</button>
      </div>
      )
      return(
      <div
        key={department.id} 
        className="bg-white font-medium text-gray-800 rounded-md px-6 py-2 border-b-2 border-b-gray-100 hover:bg-gray-100"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <RatingForm department={department} pathname={`/department/${department.id}`} key={department.id} email={email}>
          <button className="w-full text-left">{department.name}</button>
        </RatingForm>
      </div>
    )})}
  </div>

  



   

  </div>
)
}

export default SearchDepartment





