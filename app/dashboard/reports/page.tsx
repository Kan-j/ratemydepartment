import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import MyDepartmentReports from '@/components/shared/MyDepartmentReports'
import CorporateReportListClient from '@/components/shared/CorporateReportListClient'

export const dynamic = 'force-dynamic';  // Ensures this page will be rendered on the server

interface Params {
  searchParams: { [key: string]: string | undefined },
  
}
const Reports = async({searchParams}:Params) => {
  const page = parseInt(searchParams['page'] || '1')
  const corporateReportPage = parseInt(searchParams['corporate_reports_list'] || '1')
 
  return (
    <section className='flex flex-col'>
        <section className="">
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">Reports</h1>
            <Tabs defaultValue="department" className="w-full">
            <TabsList className=" bg-white">
                <TabsTrigger className='bg-white flex justify-start  data-[state=active]:text-blue-400 data-[state=active]:bg-white data-[state=active]:border-b data-[state=active]:border-b-blue-400' value="department">Department Reports</TabsTrigger>
                <TabsTrigger className='bg-white flex justify-start  data-[state=active]:text-blue-400 data-[state=active]:bg-white data-[state=active]:border-b data-[state=active]:border-b-blue-400' value="corporate">Corporate Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="department">
               <MyDepartmentReports page={page}/>
            </TabsContent>
            <TabsContent value="corporate">
                <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
                    <CorporateReportListClient page={corporateReportPage}/>
               </section>

            </TabsContent>
            </Tabs>
        </section>
    </section>
  )
}

export default Reports