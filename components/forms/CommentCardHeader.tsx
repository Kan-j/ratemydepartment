"use client"
import React from 'react'
import { Rating } from 'react-simple-star-rating'

const CommentCardHeader = ({rating}:any) => {
  return (
    <div className="flex flex-col sm:flex-row items-baseline sm:gap-4">
    <h1 className="font-bold text-gray-900">{rating?.ratedByUser?.department?.name}</h1>
    <h1 className="text-4xl text-gray-800 hidden sm:flex">.</h1>
    <Rating size={18} initialValue={rating.stars} allowHover={false} readonly={true} allowFraction={true}/>
  </div>
  )
}

export default CommentCardHeader