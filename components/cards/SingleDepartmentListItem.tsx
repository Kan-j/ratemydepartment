import React from 'react'
import { Button } from '../ui/button'
import { FaDownload } from 'react-icons/fa'
import Link from 'next/link'

const SingleDepartmentListItem = () => {
  return (
    <Link href="/" className="flex w-3/4 bg-blue-50 py-2 px-4 rounded-md justify-between items-center">
        <section className="flex">
            <h1 className="bg-blue-500 p-4 font-bold rounded-md text-xl text-white">4.5</h1>
            <section className="ml-4">
                <h1 className="font-bold text-gray-600">Corporate Strategy</h1>
                <h2 className=" text-gray-800">Q1, 2024</h2>
            </section>
        </section>

    </Link>
  )
}

export default SingleDepartmentListItem