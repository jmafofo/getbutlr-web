import React from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-4 py-2 rounded-md border bg-white text-black focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className}`}
      {...props}
    />
  )
}