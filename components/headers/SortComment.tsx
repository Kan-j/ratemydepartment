"use client"
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


const SortComment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('sort', value);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <Select onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="desc">Highest to Lowest</SelectItem>
        <SelectItem value="asc">Lowest to Highest</SelectItem>
        </SelectContent>
    </Select>
  )
}

export default SortComment