import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { FaDownload } from 'react-icons/fa'
import SingleReportListItem from '@/components/cards/SingleReportListItem'
import ReportsPagination from '@/components/cards/ReportsPagination'
import SingleCorporateReportListItem from '@/components/Admin/SingleCorporateReportListItem'


const ReportsPageAdmin = () => {
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
               <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
                    <SingleReportListItem/>
                    <SingleReportListItem/>
                    <SingleReportListItem/>
                    <SingleReportListItem/>
                    <SingleReportListItem/>
                    <SingleReportListItem/>
               </section>
               <section className="w-full ">
                    <section className="w-3/4 justify-center items-center mt-2 mb-6">
                        <ReportsPagination/>
                    </section>
               </section>
              
            </TabsContent>
            <TabsContent value="corporate">
                <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
                    <SingleCorporateReportListItem/>
                    <SingleCorporateReportListItem/>
                    <SingleCorporateReportListItem/>
                    
                    
               </section>
               <section className="w-full ">
                    <section className="w-3/4 justify-center items-center mt-2 mb-6">
                        <ReportsPagination/>
                    </section>
               </section>
            </TabsContent>
            </Tabs>
        </section>
    </section>
  )
}

export default ReportsPageAdmin