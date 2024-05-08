import React from 'react'

const CommentsCardItem = ({title, description}: {title:string, description: string}) => {
  return (
    <div className="mb-3">
        <h1 className="font-semibold text-gray-700">{title}:</h1>
        <p className="text-gray-700 text-sm">{description}</p>
    </div>
  )
}

export default CommentsCardItem