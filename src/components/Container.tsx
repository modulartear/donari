import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={['mx-auto w-full max-w-6xl px-4', className].join(' ')}>
      {children}
    </div>
  )
}

