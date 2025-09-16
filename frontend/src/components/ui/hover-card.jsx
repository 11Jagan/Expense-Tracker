import React from "react"

const HoverCard = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

const HoverCardContent = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`transition-transform duration-300 group-hover:scale-105 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export { HoverCard, HoverCardContent }