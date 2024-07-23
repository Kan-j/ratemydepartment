import PerformanceCard from '@/components/cards/PerformanceCard'
import DepartmentPerformanceChart from '@/components/shared/DepartmentPerformanceChart'
import DepartmentsPerformanceTable from '@/components/shared/DepartmentsPerformanceTable'
import QuarterSelector from '@/components/shared/QuarterSelector'
import SmallScreenInput from '@/components/shared/SmallScreenInput'
import DepartmentRankingPublishButton from '@/components/forms/DepartmentRankingPublishButton'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDepartmentStatistics,getDepartmentRankingIds, getRatingsForYear, getRatingsForTheQuarterAndYear } from '@/lib/actions'
import Image from 'next/image'
import { FaChartBar, FaHamburger } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi';

interface Props {
  searchParams: { [key: string]: string | undefined }
}


const AdminHomePage = async({searchParams}: Props) => {
  

  return (
    <div className='flex flex-col'>
      <section>
        <h1 className="">Admin Home Page</h1>
      </section>
    </div>
  )
}

export default AdminHomePage