import { CardProducto } from './CardProducto'

type ProductCardProps = {
  name: string
  description: string
  price: number
  compareAtPrice?: number
  badge?: string
}

export function ProductCard({
  name,
  description,
  price,
  compareAtPrice,
  badge,
}: ProductCardProps) {
  return (
    <CardProducto
      name={name}
      description={description}
      price={price}
      compareAtPrice={compareAtPrice}
      badgeVariant={badge ? 'default' : undefined}
      badgeText={badge}
    />
  )
}
