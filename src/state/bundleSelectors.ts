import {
  type BundleStep,
  type Category,
  type Product,
  type ProductId,
  type Variant,
  type VariantId,
  products,
} from '../data/bundleData';
import type { BundleState } from './bundleState';

export type ReviewLine = {
  lineId: string;
  productId: ProductId;
  variantId?: VariantId;
  product: Product;
  variant?: Variant;
  category: Category;
  title: string;
  image: string;
  quantity: number;
  price: number;
  oldPrice: number;
};

const DEFAULT_QUANTITY_KEY = 'default';

const getQuantityKey = (product: Product, variantId?: VariantId) =>
  product.variants?.length
    ? (variantId ?? product.variants[0].id)
    : DEFAULT_QUANTITY_KEY;

export const getLineId = (product: Product, variantId?: VariantId) =>
  variantId ? `${product.id}:${variantId}` : product.id;

export const getQuantity = (
  state: BundleState,
  product: Product,
  variantId?: VariantId,
) => state.quantities[product.id]?.[getQuantityKey(product, variantId)] ?? 0;

export const getActiveVariantId = (
  product: Product,
  state: BundleState,
): VariantId | undefined =>
  product.variants?.length
    ? (state.activeVariants[product.id] ?? product.variants[0].id)
    : undefined;

export const getProductCardQuantity = (
  product: Product,
  state: BundleState,
) => {
  return getQuantity(state, product, getActiveVariantId(product, state));
};

export const getProductSelectedQuantity = (
  product: Product,
  state: BundleState,
) => {
  if (!product.variants?.length) {
    return getQuantity(state, product);
  }

  return product.variants.reduce((sum, variant) => {
    return sum + getQuantity(state, product, variant.id);
  }, 0);
};

export const getStepSelectedCount = (step: BundleStep, state: BundleState) => {
  return products
    .filter((product) => product.stepId === step.id)
    .filter((product) => getProductSelectedQuantity(product, state) > 0).length;
};

export const getReviewLines = (state: BundleState): ReviewLine[] => {
  const lines: ReviewLine[] = [];

  products.forEach((product) => {
    if (product.variants?.length) {
      product.variants.forEach((variant) => {
        const quantity = getQuantity(state, product, variant.id);

        if (quantity > 0) {
          lines.push({
            lineId: getLineId(product, variant.id),
            productId: product.id,
            variantId: variant.id,
            product,
            variant,
            category: product.category,
            title: product.title,
            image: product.image,
            quantity,
            price: product.price,
            oldPrice: product.oldPrice ?? product.price,
          });
        }
      });
      return;
    }

    const quantity = getQuantity(state, product);
    if (quantity > 0) {
      lines.push({
        lineId: getLineId(product),
        productId: product.id,
        product,
        category: product.category,
        title: product.title,
        image: product.image,
        quantity,
        price: product.price,
        oldPrice: product.oldPrice ?? product.price,
      });
    }
  });

  return lines;
};

export const getTotals = (state: BundleState) => {
  const lines = getReviewLines(state).filter(
    (line) => line.category !== 'shipping',
  );
  const total = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );
  const oldTotal = lines.reduce(
    (sum, line) => sum + line.oldPrice * line.quantity,
    0,
  );

  return {
    total,
    oldTotal,
    savings: Math.max(oldTotal - total, 0),
  };
};

export const getNextStepId = (stepId: BundleStep['id']): BundleStep['id'] => {
  const order: BundleStep['id'][] = [
    'cameras',
    'plan',
    'sensors',
    'protection',
  ];
  const index = order.indexOf(stepId);
  return order[Math.min(index + 1, order.length - 1)];
};
