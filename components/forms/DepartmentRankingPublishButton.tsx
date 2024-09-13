import React from 'react'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { IoMenu } from 'react-icons/io5';
import RankingsPublishButton from './RankingsPublishButton';
import { getDepartmentRankingDataForAdmin, getDownloadableRatingsDataForQuarterAndYear, getDownloadableRatingsDataForYear } from '@/lib/actions';
import DownloadOption from './DownloadOption';


const DepartmentRankingPublishButton = async({departmentRankingIds, quarter, year}:{departmentRankingIds: any, quarter:number, year:number}) => {
  const rankingsDataForAdmin = await getDepartmentRankingDataForAdmin(quarter, year)
  // SESSION ADDED
  const downloadableRatingsDataForQuarterAndYear = await getDownloadableRatingsDataForQuarterAndYear(quarter, year)
  const downloadableRatingsDataForYear = await getDownloadableRatingsDataForYear(year)

  return (
    <>
      <section className="flex items-center gap-2">
        <RankingsPublishButton departmentRankingIds={departmentRankingIds}/>
        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                  <IoMenu fontSize={30}/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <DownloadOption data={rankingsDataForAdmin} title={'Download Ranking List'} fileName={`Rankings_Q${quarter}_${year}`}/>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DownloadOption data={downloadableRatingsDataForQuarterAndYear} title={'Download Ratings For Quarter'} fileName={`SurveyResults_Q${quarter}_${year}`}/>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DownloadOption data={downloadableRatingsDataForYear} title={'Download Ratings For Year'} fileName={`SurveyResults_${year}`}/>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
      </section>
    </>
    
  )
}

export default DepartmentRankingPublishButton