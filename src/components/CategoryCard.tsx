import { CardCategoria } from './CardCategoria'

type CategoryCardProps = {
  title: string
  description: string
  to: string
  accent: 'neon' | 'electric'
}

export function CategoryCard({ title, description, to, accent }: CategoryCardProps) {
  return (
    <CardCategoria
      title={title}
      description={description}
      to={to}
      accent={accent}
    />
  )
}
