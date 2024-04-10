// import SearchDepartment from "@/components/forms/SearchDepartment";
import SearchDepartment from "@/components/forms/SearchDepartment";
import Image from "next/image";

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

export default function Home() {
  return (
    <main>
      <section className="text-white mt-14 md:mt-1 flex flex-col items-center">
        <h3 className="font-bold md:text-4xl text-xl text-white">RateMy<span className="text-white bg-blue-500 px-2">Department</span></h3>
        <p className="text-sm md:text-lg">Enter the name of the department you want to rate</p>
        <section>
          <SearchDepartment />
        </section>
      </section>
       <section className="flex flex-col items-center md:items-stretch w-full md:flex-row mt-8 gap-4 mb-24 md:mb-0">
          {items.map((item)=> {
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md flex flex-1 w-full  flex-col items-center text-gray-800 justify-center px-4 py-4 ">
                <Image src={item.img} className="h-full w-32 md:w-48" alt="alt" width={200} height={300} />
                <h1 className="mt-2 font-semibold min-w-64 text-center">{item.title}</h1>
              </div>
            )
          })}
      </section>
    </main>
  );
}
