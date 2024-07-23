import React from 'react'
import { Button } from '../ui/button'
import { FaDownload } from 'react-icons/fa'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { IoMenu } from 'react-icons/io5'

const SingleCorporateReportListItem = () => {
  return (
    <section className="flex w-3/4 bg-blue-50 py-2 px-4 rounded-md justify-between items-center">
        <section className="flex">
            <h1 className="bg-blue-500 p-4 font-bold rounded-md text-xl text-white">4.5</h1>
            <section className="ml-4">
                <h1 className="text-gray-600">Corporate Strategy</h1>
                <h2 className="font-bold text-gray-800">Q1, 2024</h2>
            </section>
        </section>
        <section className="">
        {/* <Button className="flex gap-2">
            <FaDownload/>
            <span className="">Download</span>
        </Button> */}
         <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                  <IoMenu fontSize={30}/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <span>Publish</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Update</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Preview</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Download</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    </section>
  )
}

export default SingleCorporateReportListItem