"use client"
import React from 'react'
import ReactSpeedometer from 'react-d3-speedometer/slim';

const SpeedmeterComponent = () => {
  return (
    <ReactSpeedometer
    minValue={0}
    maxValue={5}
    value={4.7}
    needleColor="red"
    startColor="red"
    segments={10}
    endColor="green"
    height={300}
    // width={300}
    fluidWidth={true}
  />
  )
}

export default SpeedmeterComponent