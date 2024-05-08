// import SearchDepartment from "@/components/forms/SearchDepartment";
import SearchDepartment from "@/components/forms/SearchDepartment";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";


const items  = [
  {
    id: 1,
    img: "/assets/search.svg",
    title: 'Search for Departments'
  },
  {
    id: 2,
    img: "/assets/review.svg",
    title: 'Rate various Departments'
  },
  {
    id: 3,
    img: "/assets/feedback.svg",
    title: 'Give your feedback'
  },
]

export default async function Home() {
  const session = await getServerSession()
  const email = session?.user?.email
  
  const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`)
  const  userDetails= await response.json()
  const {departmentId, isAdmin} = userDetails.user

  return (
    <main>
      <section className="text-white mt-14 md:mt-1 flex flex-col items-center relative">
        {isAdmin? <Link href="/admin" className="font-bold md:text-4xl text-xl text-white">RateYour<span className="text-white bg-blue-500 px-2">Department</span></Link>:<h3 className="font-bold md:text-4xl text-xl text-white">RateYour<span className="text-white bg-blue-500 px-2">Department</span></h3>}
        <p className="text-sm md:text-lg">Enter the name of the department you want to rate</p>
        <section>
          <SearchDepartment mydepartmentId={departmentId}/>
        </section>
      </section>
       <section className="flex flex-col items-center md:items-stretch w-full md:flex-row mt-8 gap-4 mb-24 md:mb-0 flex-1">
          {items.map((item)=> {
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md flex flex-1 w-full  flex-col items-center text-gray-800 justify-center px-4 py-4 ">
                <Image src={item.img} className="h-full w-32 md:w-48" alt="alt" width={200} height={300} />
                <h1 className="mt-2 font-semibold min-w-64 text-center text-sm md:text-base">{item.title}</h1>
              </div>
            )
          })}
      </section>
      <ToastContainer />
    </main>
  );
}
