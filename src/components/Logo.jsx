import React from 'react'

function Logo({width = '100px'}) {
  return (
    <img
      src='/food.png'
      alt="Logo"
      className="w-32 h-32 rounded-full"
      style={{ width, height: "auto", display: "block",  }}
    />
  )
}

export default Logo