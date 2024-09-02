import React from 'react'
import Link from 'next/link'

interface SingleDepartmentListItemProps {
  name: string;
  averageScore: number;
  quarter: number;
  year: number;
  id: number
}

const SingleDepartmentListItem: React.FC<SingleDepartmentListItemProps> = ({ id,name, averageScore, quarter, year }) => {
  return (
    <Link href={`/admin/departments/${id}`} className="flex w-3/4 bg-blue-50 py-2 px-4 rounded-md justify-between items-center">
        <section className="flex">
            <h1 className="bg-blue-500 p-4 font-bold rounded-md text-xl text-white">{averageScore.toFixed(2)}</h1>
            <section className="ml-4">
                <h1 className="font-bold text-gray-600">{name}</h1>
                <h2 className=" text-gray-800">Q{quarter}, {year}</h2>
            </section>
        </section>

    </Link>
  )
}

export default SingleDepartmentListItem