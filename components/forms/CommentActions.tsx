"use client"
import { getRatingProperties, toggleExcludeFromAverage, toggleIsHidden } from '@/lib/actions';
import React, { useEffect, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoBan, IoCheckmarkCircleSharp } from 'react-icons/io5';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const CommentActions = ({id}:{id:number}) => {
    const [isEyeOpen, setIsEyeOpen] = useState(true);
    const [isProhibited, setIsProhibited] = useState(true);
    
    // Function to fetch the initial state from the server
  const fetchInitialState = async () => {
    try {
      const { isHidden, excludeFromAverage } = await getRatingProperties(id);
      setIsEyeOpen(!isHidden);
      setIsProhibited(!excludeFromAverage);
    } catch (error) {
      console.error('Error fetching initial state:', error);
    }
  };

  // Fetch initial state when component mounts
  useEffect(() => {
    fetchInitialState();
  }, [id]);


  // Function to toggle the isHidden property
  const toggleEye = async () => {
    try {
      await toggleIsHidden(id);
      setIsEyeOpen((prevState) => !prevState);
    } catch (error) {
      console.error('Error toggling isHidden:', error);
    }
  };
  

    // Function to toggle the excludeFromAverage property
    const toggleProhibited = async () => {
        try {
        await toggleExcludeFromAverage(id);
        setIsProhibited((prevState) => !prevState);
        } catch (error) {
        console.error('Error toggling excludeFromAverage:', error);
        }
    };

  

  return (
    <section className="flex gap-4 items-center">
         <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={toggleEye}>
                {isEyeOpen ? <FaEye size={23} /> : <FaEyeSlash size={23} />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isEyeOpen ? 'Hide Comment' : 'Show Comment'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

         <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
            <button onClick={toggleProhibited}>
            {isProhibited ? <IoBan size={23} /> : <IoCheckmarkCircleSharp size={23} color='red' />}
            </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isProhibited ? 'Exclude from Department Score calculation' : 'Include in Department Score calculation'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* <FaEye size={23}/>
        <IoBan size={23}/> */}
    </section>
  )
}

export default CommentActions