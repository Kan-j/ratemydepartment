import DepartmentListPagination from "@/components/cards/DepartmentListPagination"
import SingleDepartmentListItem from "@/components/cards/SingleDepartmentListItem"
import SearchBar from "@/components/forms/SearchBar"


const page = () => {
  return (
    <div className="flex flex-col">
       <section className="flex flex-col  justify-end mb-6 md:mb-0 ">
        <section className="flex justify-end w-2/6 ">
          <SearchBar/>
        </section>
        <div className="border-b pb-4 mb-2 w-4/5"/>
      </section>

      <section className="flex flex-col gap-2">
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
        <SingleDepartmentListItem/>
      </section>
      <section className="w-4/5 flex justify-center mb-4 mt-4">
        <DepartmentListPagination/>
      </section>
    </div>
  )
}

export default page