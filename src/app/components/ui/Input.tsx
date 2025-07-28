import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 rounded-md border bg-white text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className}`}
      {...props}
    />
  )
}