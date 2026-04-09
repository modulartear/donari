import { Container } from './Container'

type FooterLink = {
  label: string
  href: string
}

type FooterProps = {
  brandName?: string
  tagline?: string
  links?: FooterLink[]
  className?: string
}

export function Footer({
  brandName = 'DON ARII Gamer Store',
  tagline = 'Computadoras, hardware gamer y periféricos.',
  links = [],
  className,
}: FooterProps) {
  return (
    <footer
      className={['border-t border-white/10 bg-black/40', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Container className="flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <div className="text-sm font-extrabold tracking-wide text-white">{brandName}</div>
          <div className="mt-1 text-sm text-white/60">{tagline}</div>
        </div>

        {links.length ? (
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/60 hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                {l.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="text-sm text-white/60">
          © {new Date().getFullYear()} DON ARII. Todos los derechos reservados.
        </div>
      </Container>
    </footer>
  )
}

