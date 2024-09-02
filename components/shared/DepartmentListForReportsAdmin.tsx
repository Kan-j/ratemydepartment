import { getAllDepartments } from '@/lib/actions'
import React from 'react'
import Link from 'next/link'
import DepartmentListForReportsAdminPagination from './DepartmentListForReportsAdminPagination'


const DepartmentListForReportsAdmin = async({page}:{page:number}) => {
  const {departments, totalPages, NextPageExists,PrevPageExists,currentPage} = await getAllDepartments(page)


  return (
    <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
        <div className="space-y-2 flex flex-col">
        {departments && departments.length > 0 ? (departments.map((department:any) => (
            <Link  key={department.id} href={`/admin/reports/departments/${department.id}`} className='bg-blue-100 w-3/5 py-3 px-2 rounded-md hover:bg-blue-400 hover:text-white  text-gray-800 '>
                {department.name} Reports
            </Link>
        ))):(<h1>No Departments available for this page</h1>)}
      </div>
      <section className="w-10/12">
        <DepartmentListForReportsAdminPagination NextPageExists={NextPageExists} PrevPageExists={PrevPageExists} totalPages={totalPages} currentPage={currentPage}/>
      </section>
      
    </section>
  )
}

export default DepartmentListForReportsAdmin