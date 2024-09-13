import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import DepartmentListForReportsAdmin from '@/components/shared/DepartmentListForReportsAdmin'
import CorporateReportsList from '@/components/shared/CorporateReportsList'
import AddCorporateReportDialog from '@/components/shared/AddCorporateReportDialog'
import { Button } from '@/components/ui/button'

interface Params {
    searchParams: { [key: string]: string | undefined },
}


const ReportsPageAdmin = ({searchParams}:Params) => {
    const page = parseInt(searchParams['departments_list'] || '1')
    const corporateReportPage = parseInt(searchParams['corporate_reports_list'] || '1')

  return (
    <section className='flex flex-col'>
        <section className="">
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">Reports</h1>
            <Tabs defaultValue="department" className="w-full">
            <TabsList className=" bg-white">
                <TabsTrigger className='bg-white flex justify-start  data-[state=active]:text-blue-400 data-[state=active]:bg-white data-[state=active]:border-b data-[state=active]:border-b-blue-400 font-semibold' value="department">Department Reports</TabsTrigger>
                <TabsTrigger className='bg-white flex justify-start  data-[state=active]:text-blue-400 data-[state=active]:bg-white data-[state=active]:border-b data-[state=active]:border-b-blue-400 font-semibold' value="corporate">Corporate Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="department">
                <DepartmentListForReportsAdmin page={page}/>              
            </TabsContent>
            <TabsContent value="corporate">
                <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
                    <section className="flex w-3/4 justify-end">
                        <AddCorporateReportDialog>
                            <Button className="text-lg">Add Corporate Report</Button>
                        </AddCorporateReportDialog>
                    </section>
                </section>

                <CorporateReportsList page={corporateReportPage}/>
                
            </TabsContent>
            </Tabs>
        </section>
    </section>
  )
}

export default ReportsPageAdmin