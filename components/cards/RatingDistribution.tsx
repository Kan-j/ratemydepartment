"use client"

import { starRatings } from "@/constants"
import { Rating } from "react-simple-star-rating"

const RatingDistribution = ({starsCount}:{starsCount: { [key: number]: number }}) => {
  return (
    <section className="flex flex-col justify-start">
            <h1 className='font-semibold text-lg md:text-xl lg:text-2xl mb-2 text-gray-800'>Rating Distribution</h1>
            <section className=''>
                <div className=' hidden md:flex flex-col gap-2 text-gray-700'>
                {starRatings.map((rating, index) => (
                    <article key={index} className='grid grid-cols-2 align-middle max-w-96 items-center gap-0'>
                        <p className="text-xs md:text-sm lg:text-base font-medium">{rating.label}</p>
                        <span className='text-xs md:text-sm lg:text-base font-medium'><Rating size={28} initialValue={rating.value} allowHover={false} readonly={true} allowFraction={true}/>({starsCount[rating.value] || 0})</span>
                    </article>
                    ))}
                </div>
                <div className='flex md:hidden flex-col gap-2  h-full w-full '>
                {starRatings.map((rating, index) => (
                    <article key={index} className='grid grid-cols-2 align-middle items-center gap-1 max-w-96'>
                        <p className="text-sm font-medium">{rating.label}</p>
                        <span className='text-xs font-medium'><Rating size={24} initialValue={rating.value} allowHover={false} readonly={true} allowFraction={true}/>({starsCount[rating.value] || 0})</span>
                    </article>
                    ))}
                </div>
          </section>
          </section>
  )
}

export default RatingDistribution