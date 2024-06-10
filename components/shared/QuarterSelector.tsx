"use client"

import { useEffect, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const QuarterSelector = ({screen}:{
    screen: 'small' |'big'
}) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()


    const today = new Date();
    const currentYear = today.getFullYear();
    const currentQuarter = Math.ceil((today.getMonth() + 1) / 3)

    const [quarters, setQuarters] = useState<number[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [selectedQuarter, setSelectedQuarter] = useState<number>(currentQuarter);
    const [dropdownTitle, setDropdownTitle] = useState<string>(`Quarter ${selectedQuarter}, ${selectedYear}`);



    const handleShowResults = () => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set("q",`${selectedQuarter}`)
        current.set("y",`${selectedYear}`)
        const search = current.toString();
        const query = search ? `?${search}` : "";
        setDropdownTitle(`Quarter ${selectedQuarter}, ${selectedYear}`);
        router.push(`${pathname}${query}`);
        
    };


  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startingYear = 2024;
    
    const yearList = [];
    setDropdownTitle(`Quarter ${selectedQuarter}, ${selectedYear}`);

    for (let year = startingYear; year <= currentYear; year++) {
      yearList.push(year);
    }

    setYears(yearList);
  }, []); // useEffect runs only once on component mount


  
  useEffect(() => {
    // Generate quarters based on the selected year
    const today = new Date();

    if (selectedYear === 2024) {
      setQuarters([2, 3, 4]);
    } else {
      setQuarters([1, 2, 3, 4]);
    }
  }, [selectedYear]);

  return (
    <section className="text-right">
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className={`text-gray-600 ${screen === 'small'? 'flex md:hidden': 'hidden md:flex'}`}>{dropdownTitle}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
                <div className="grid gap-4">
                    <div className="space-y-2">
                    <section className="flex flex-col " >
                        <div className="flex gap-4 mb-3">
                            <select className="bg-white p-2" value={selectedQuarter} onChange={(e) => setSelectedQuarter(parseInt(e.target.value))}>
                            {quarters.map((quarter, index) => (
                                <option value={quarter} key={index} className="px-2 py-2">Quarter {quarter}</option>
                            ))}
                            </select>
                            <select className="bg-white" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                                {years.map((year, index) => (
                                    <option value={year} key={index}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <Button variant="outline" onClick={handleShowResults}>Show Results</Button>
                    </section>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    </section>
  )
}

export default QuarterSelector