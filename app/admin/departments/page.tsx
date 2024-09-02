import DepartmentListPagination from "@/components/cards/DepartmentListPagination"
import SingleDepartmentListItem from "@/components/cards/SingleDepartmentListItem"
import SearchBar from "@/components/forms/SearchBar"
import { getAllDepartmentsWithAverageScore } from "@/lib/actions"


const DepartmentsPage = async() => {
  const departments= await getAllDepartmentsWithAverageScore()
  return (
    <div className="flex flex-col">
       <section className="flex flex-col  justify-end mb-6 md:mb-0 ">
        <section className="flex justify-end w-2/6 ">
          <SearchBar isAdmin={true}/>
        </section>
        <div className="border-b pb-4 mb-2 w-4/5"/>
      </section>

      <section className="flex flex-col gap-2">
        {departments.map((department:any) => (
          <SingleDepartmentListItem
            key={department.id}
            id={department.id}
            name={department.name}
            averageScore={department.averageScore}
            quarter={department.quarter}
            year={department.year}
          />
        ))}
        
      </section>
      <section className="w-4/5 flex justify-center mb-4 mt-4">
        <DepartmentListPagination/>
      </section>
    </div>
  )
}

export default DepartmentsPage