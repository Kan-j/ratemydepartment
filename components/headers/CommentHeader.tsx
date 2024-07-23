import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
 } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { IoMenu, IoOptions } from 'react-icons/io5'

const CommentHeader = ({ratingsLength, isMyDepartment}:any) => {
  return (
    <section className="grid grid-cols-2 mt-12 mb-6">
        <h1 className="text-xl md:text-2xl text-gray-900 font-semibold">Comments ({ratingsLength})</h1>
        <section className="flex gap-3 text-gray-700 ">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest_first">Highest to Lowest</SelectItem>
                <SelectItem value="lowest_first">Lowest to Highest</SelectItem>
              </SelectContent>
            </Select>
            {isMyDepartment && (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                  <IoMenu fontSize={30}/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <span>Download for the quarter</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Download for the year</span>
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