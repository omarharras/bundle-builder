import type { Product } from '../data/bundleData'

export const formatMoney = (amount: number) => {
  if (amount === 0) {
    return 'FREE'
  }

  return `$${amount.toFixed(2)}`
}

export function productOldPrice(product: Product) {
  return product.oldPrice
}
