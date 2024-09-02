import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import MyDepartmentReports from '@/components/shared/MyDepartmentReports'

interface Params {
  searchParams: { [key: string]: string | undefined },
  
}
const Reports = async({searchParams}:Params) => {
  const page = parseInt(searchParams['page'] || '1')
 
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
                    {/* <SingleReportListItem/>
                    <SingleReportListItem/> */}
                    
                    
               </section>
               <section className="w-full ">
                    <section className="w-3/4 justify-center items-center mt-2 mb-6">
                        {/* <ReportsPagination/> */}
                    </section>
               </section>

            </TabsContent>
            </Tabs>
        </section>
    </section>
  )
}

export default Reports