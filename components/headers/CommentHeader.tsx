import React from 'react'

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
 } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { IoMenu } from 'react-icons/io5'
import SortComment from './SortComment'
import { getDepartmentRatingsForQuarter, getDepartmentRatingsForYear, getQuarterlyDepartmentRatingsForAdmin, getYearlyDepartmentRatingsForAdmin } from '@/lib/actions'
import DownloadOption from '../forms/DownloadOption'


const CommentHeader = async({ratingsLength, isMyDepartment,isAdmin, quarter, year,  departmentId}:any) => {
  
  const getFilename = ({data, justYear=false}:{data:any, justYear?:boolean}) => {
    if (data.length === 0) {
      return 'file';
    }
    
    const { 'Department Rated': departmentName, year, quarter } = data[0];
    return justYear ? `${departmentName}_${year}` : `${departmentName}_${quarter}_${year}`;
  };

  if(!isAdmin){
    const ratingsForTheQuarterAndYear = await getDepartmentRatingsForQuarter(departmentId, quarter, year)
    const ratingsForTheYear = await getDepartmentRatingsForYear(departmentId, year)

    return (
      <section className="grid grid-cols-2 mt-12 mb-6">
          <h1 className="text-xl md:text-2xl text-gray-900 font-semibold">Comments ({ratingsLength})</h1>
          <section className="flex gap-3 text-gray-700 ">
              <SortComment/>
              {(isAdmin || isMyDepartment) && (
                  <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                    <IoMenu fontSize={30}/>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <DownloadOption
                          data={ratingsForTheQuarterAndYear}
                          title="Download for the quarter"
                          fileName={getFilename({ data: ratingsForTheQuarterAndYear })}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DownloadOption
                          data={ratingsForTheYear}
                          title="Download for the year"
                          fileName={getFilename({ data: ratingsForTheYear, justYear: true })}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              
            </section>
      </section>
    )
  }


  const ratingsForTheQuarterAndYear = await getQuarterlyDepartmentRatingsForAdmin(departmentId, quarter, year)
  const ratingsForTheYear = await getYearlyDepartmentRatingsForAdmin(departmentId, year)

  
  return (
    <section className="grid grid-cols-2 mt-12 mb-6">
        <h1 className="text-xl md:text-2xl text-gray-900 font-semibold">Comments ({ratingsLength})</h1>
        <section className="flex gap-3 text-gray-700 ">
            <SortComment/>
            {(isAdmin || isMyDepartment) && (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                  <IoMenu fontSize={30}/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                  <DropdownMenuItem>
                      <DownloadOption
                        data={ratingsForTheQuarterAndYear}
                        title="Download for the quarter"
                        fileName={getFilename({ data: ratingsForTheQuarterAndYear })}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DownloadOption
                        data={ratingsForTheYear}
                        title="Download for the year"
                        fileName={getFilename({ data: ratingsForTheYear, justYear: true })}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            
          </section>
    </section>
  )
  
}

export default CommentHeader