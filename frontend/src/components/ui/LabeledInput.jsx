import React from 'react'

const LabeledInput = ({ children }) => {
  return (
    <div className="flex flex-col gap-1">
      {children}
    </div>
  )
}

export default LabeledInput
