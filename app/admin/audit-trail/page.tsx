import React from 'react'


import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FilterComponent from '@/components/AuditTrail/FilterComponent'
import { Button } from '@/components/ui/button'


const data = [
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  }
]

const AuditTrailPage = () => {
  return (
    <section className='flex flex-col'>
        <section className="">
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">Audit Trail</h1>
            <p className="text-gray-800">Monitor any changes done to the platform</p>

            <section className="mt-5 bg-blue-50 px-5 py-3 rounded-md">
              <FilterComponent/>
            </section>

            <section className="mt-5 flex justify-end w-full">
              <Button>Download</Button>
            </section>

            <section className="mt-5">
              <Table>
                  <TableHeader >
                    <TableRow>
                      <TableHead className="text-gray-800 font-semibold">Name</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Email</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Action</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Timestamp</TableHead>
                      <TableHead className="text-gray-800 font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((invoice,index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-gray-700">{invoice.FullName}</TableCell>
                        <TableCell className='text-gray-700'>{invoice.Email}</TableCell>
                        <TableCell className='text-gray-700'>{invoice.Action}</TableCell>
                        <TableCell className='text-gray-700'>{invoice.Timeline}</TableCell>
                        <TableCell className='text-gray-700'>{invoice.Description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </section>
        </section>
    </section>
  )
}

export default AuditTrailPage