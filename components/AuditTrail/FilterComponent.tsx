'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { cn } from '@/lib/utils'
import { addDays, format, parseISO, subDays } from "date-fns"
import { DateRange } from 'react-day-picker'
import { usePathname, useRouter } from 'next/navigation'


// Dummy action types and models (replace with real data)
const actionTypes = ["findMany","findUnique", "create", "update", "count", "upsert"]
const models = ["CorporateReport", "DepartmentRanking", "Rating", "Department", "User"]

const FilterComponent = () => {

  // Track selected action types and models
  const [selectedActionTypes, setSelectedActionTypes] = useState<string[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  // Initialize date range as undefined to indicate no selection
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  })
  const router = useRouter()
  const pathname = usePathname();

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    

    // Parse date range
    const dateFromParam = urlParams.get('dateFrom');
    const dateToParam = urlParams.get('dateTo');
    const dateFrom = dateFromParam ? parseISO(dateFromParam) : subDays(new Date(), 2); // Default to 2 days ago
    const dateTo = dateToParam ? parseISO(dateToParam) : new Date(); // Default to today
    setDate({ from: dateFrom, to: dateTo });

    // Parse action types
    const actionTypesParam = urlParams.getAll('actionTypes');
    if (actionTypesParam.length > 0) {
      setSelectedActionTypes(actionTypesParam);
    }

    // Parse models
    const modelsParam = urlParams.getAll('models');
    if (modelsParam.length > 0) {
      setSelectedModels(modelsParam);
    }
  }, []);


    // 2. Handle form submission
    function onSubmit() {
  
      const queryParams = new URLSearchParams();

    if (date?.from) {
      queryParams.append('dateFrom', format(date.from, 'yyyy-MM-dd'));
    }
    if (date?.to) {
      queryParams.append('dateTo', format(date.to, 'yyyy-MM-dd'));
    }

    selectedActionTypes.forEach(actionType => {
      queryParams.append('actionTypes', actionType);
    });

    selectedModels.forEach(model => {
      queryParams.append('models', model);
    });

    // Convert the query parameters to a string
    const queryString = queryParams.toString();

    // Update the URL with the new query parameters
    const newUrl = `${pathname}?${queryString}`;
    router.push(newUrl)


    }

  // Helper function to toggle action type selection
  const toggleActionType = (actionType: string) => {
    const updatedActionTypes = selectedActionTypes.includes(actionType)
      ? selectedActionTypes.filter(type => type !== actionType)
      : [...selectedActionTypes, actionType]

    setSelectedActionTypes(updatedActionTypes)
  }

  // Helper function to toggle model selection
  const toggleModel = (model: string) => {
    const updatedModels = selectedModels.includes(model)
      ? selectedModels.filter(m => m !== model)
      : [...selectedModels, model]

    setSelectedModels(updatedModels)
  }

  return (
    <section>
      <section  className="flex flex-row justify-between items-center">
        <section className="flex flex-row gap-4">
          
          {/* Dropdown for Action Type */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className='text-gray-800'>
                {selectedActionTypes.length > 0
                  ? `Actions`
                  : "Filter Action"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {actionTypes.map((action) => (
                  <DropdownMenuItem
                    key={action}
                    onSelect={() => toggleActionType(action)} // Toggle action type on select
                    className={selectedActionTypes.includes(action) ? "bg-gray-200" : ""} // Highlight selected
                  >
                    <span>{action}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown for Model */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className='text-gray-800'>
                {selectedModels.length > 0
                  ? `Models`
                  : "Filter Model"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onSelect={() => toggleModel(model)} // Toggle model on select
                    className={selectedModels.includes(model) ? "bg-gray-200" : ""} // Highlight selected
                  >
                    <span>{model}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>


          <div className="grid gap-2">
            <Popover>
            <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal text-gray-800",
                    !date?.from && "text-muted-foreground" // Gray text until a date is selected
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Filter Date Range</span> // Default text when no date is selected
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()} // Start with today's date
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

        </section>

        {/* Buttons for submitting or clearing the form */}
        <section className="flex gap-4">
          <Button type="submit" onClick={onSubmit}>Apply Filters</Button>
          <Button variant='outline' type='button' onClick={() => {
            setSelectedActionTypes([]) // Clear action type selection
            setSelectedModels([]) // Clear model selection
            setDate({ from: undefined, to: undefined }) // Clear date range selection
             // Clear URL search parameters
            const queryParams = new URLSearchParams();
            const newUrl = `${window.location.pathname}?${queryParams.toString()}`;
            window.history.pushState(null, '', newUrl);
          }}>
            Clear Filters
          </Button>
        </section>
      </section>
    </section>
  )
}

export default FilterComponent

