import React from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { IoMenu } from 'react-icons/io5';
import { FaFile } from 'react-icons/fa6';
import AddCorporateReportDialog from '../shared/AddCorporateReportDialog';

// Define the type for the report prop

// Define the type for the report prop
interface SingleCorporateReportListItemProps {
  report: {
    id: number;
    quarter: string;
    year: string;
    fileUrl: string;
    isPublished: boolean;
  };
  onTogglePublish: (reportId: number) => void; // Handler for toggling publish status
}

const SingleCorporateReportListItem: React.FC<SingleCorporateReportListItemProps> = ({ report, onTogglePublish }) => {

  return (
    <section className="flex w-3/4 bg-blue-50 py-2 px-4 rounded-md justify-between items-center">
      <section className="flex">
        <h1 className="bg-blue-500 p-4 font-bold rounded-md text-xl text-white">
          <FaFile />
        </h1>
        <section className="ml-4">
          <h1 className="text-gray-600">Corporate Report</h1>
          <h2 className="font-bold text-gray-800">{report.quarter}, {report.year}</h2>
        </section>
      </section>
      <section className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <IoMenu fontSize={30} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem className='cursor-pointer' onClick={() => onTogglePublish(report.id)}>
                <span>{report.isPublished ? 'Unpublish' : 'Publish'}</span>
              </DropdownMenuItem>
             
                
                  <AddCorporateReportDialog report={report}>
                    {/* <DropdownMenuItem   onClick={(e) => e.stopPropagation()} > */}
                    <p className='cursor-pointer pl-2 py-2 px-3 hover:bg-blue-50 text-sm'>Update</p>
                    {/* </DropdownMenuItem> */}
                  </AddCorporateReportDialog>
                 

            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </section>
  );
}

export default SingleCorporateReportListItem;
