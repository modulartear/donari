import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="text-xs font-semibold tracking-wider text-brand-neon/90">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-white/70 md:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

