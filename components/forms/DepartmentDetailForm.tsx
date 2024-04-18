"use client"

import { Rating } from 'react-simple-star-rating'

interface DepartmentDetails {
    department: {
      id: number;
      name: string;
      ratings: { id: number; stars: number; }[];
    };
    totalRatings: number;
    starsCount: { [key: number]: number };
    averageStars: number;
  }



const DepartmentDetail = ({department,totalRatings,starsCount,averageStars}:DepartmentDetails) => {


    const starRatings = [
        { label: 'Exceptional', value: 5 },
        { label: 'Exceeds', value: 4 },
        { label: 'Average(Meet)', value: 3 },
        { label: 'Below Average', value: 2 },
        { label: 'Poor', value: 1 }
      ];
      

  return (
    <section className='flex h-screen md:h-full flex-col gap-6 mt-6 md:mt-0 md:gap-0 mx-auto items-center justify-start md:items-start md:flex-row md:justify-around w-full'>
        <article>
            <section className='flex flex-col items-start'>
            <h1 className="text-2xl md:text-5xl text-gray-800 font-semibold md:mb-2">{department.name}</h1>
                <div className="flex flex-row text-gray-900 mb-0 md:mb-1">
                    <h1 className="text-2xl md:text-8xl font-bold">{averageStars}</h1>
                </div>
                <h1 className="font-medium md:font-bold  mb-0 md:mb-2 text-base md:text-base">Overall Quality Based on <span className="underline">
                    {totalRatings} ratings</span></h1>
                

            </section>
        
        </article>

        <article className='flex flex-col items-start md:block'>
            <h1 className='font-bold md:text-xl mb-3 text-center w-full md:text-left'>Rating Distribution</h1>
            <section className='flex flex-col md:flex-row items-center gap-2 md:gap-6'>
                <div className=' hidden md:flex flex-col gap-2 items-center h-full w-full justify-center'>
                {starRatings.map((rating, index) => (
                    <article key={index} className='grid grid-cols-2 align-middle items-center gap-1'>
                        <p className="text-xs md:text-base font-medium">{rating.label}</p>
                        <span className='text-base font-medium'><Rating size={28} initialValue={rating.value} allowHover={false} readonly={true} allowFraction={true}/> ({starsCount[rating.value] || 0})</span>
                    </article>
                    ))}
                </div>
                <div className='flex md:hidden flex-col gap-2 items-center h-full w-full justify-center'>
                {starRatings.map((rating, index) => (
                    <article key={index} className='grid grid-cols-2 align-middle items-center gap-1'>
                        <p className="text-sm font-medium">{rating.label}</p>
                        <span className='text-xs font-medium'><Rating size={24} initialValue={rating.value} allowHover={false} readonly={true} allowFraction={true}/> ({starsCount[rating.value] || 0})</span>
                    </article>
                    ))}
                </div>
            </section>
        </article>

    </section>
  )
}

export default DepartmentDetail