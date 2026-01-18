import React from 'react'

const Input = ({ textarea, ...props}) => {

  if (textarea) {
    return (
      <textarea
      className="
            px-3 py-1.5 rounded-md
            bg-white/30 text-white placeholder-white/70
            outline-none
            focus:ring-2 focus:ring-white/50
            border border-white/20
            backdrop-blur-md
            shadow-[0_4px_15px_rgb(0,0,0,0.1)]
            transition-all duration-200
            w-96
          "
      {...props}
      />
    )
  }

  return (
    <input
    className="
          px-3 py-1.5 rounded-md
          bg-white/30 text-white placeholder-white/70
          outline-none
          focus:ring-2 focus:ring-white/50
          border border-white/20
          backdrop-blur-md
          shadow-[0_4px_15px_rgb(0,0,0,0.1)]
          transition-all duration-200
          w-96
        "
    {...props}
    />
  )
}

export default Input
