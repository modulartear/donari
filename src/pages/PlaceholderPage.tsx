import { Container } from '../components/Container'

type PlaceholderPageProps = {
  title: string
  description?: string
}

export default function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="py-12">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-3xl font-black text-white">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-white/70">{description}</p>
          ) : null}
        </div>
      </Container>
    </div>
  )
}

