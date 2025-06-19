import React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`rounded-lg shadow-md border border-slate-700 bg-slate-900 ${className}`}
      {...props} // ← this spreads standard div props like `id`
    >
      {children}
    </div>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "", ...props }) => {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>
}
