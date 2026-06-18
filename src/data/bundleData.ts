import bundleData from './bundleData.json';

export type StepId = 'cameras' | 'plan' | 'sensors' | 'protection';
export type Category =
  | 'cameras'
  | 'sensors'
  | 'accessories'
  | 'plan'
  | 'shipping';
export type ProductId = string;
export type VariantId = string;
export type ProductQuantities = Record<VariantId | 'default', number>;
export type BundleQuantities = Record<ProductId, ProductQuantities>;

export type Variant = {
  id: VariantId;
  label: string;
  image: string;
};

export type Product = {
  id: ProductId;
  stepId?: StepId;
  category: Category;
  title: string;
  description?: string;
  badge?: string;
  image: string;
  variants?: Variant[];
  price: number;
  oldPrice?: number;
  minQuantity?: number;
};

export type BundleStep = {
  id: StepId;
  order: number;
  label: string;
  title: string;
  nextLabel?: string;
};

type BundleData = {
  steps: BundleStep[];
  products: Product[];
  initialActiveVariants: Record<ProductId, VariantId>;
  initialQuantities: BundleQuantities;
  categoryLabels: Record<Category, string>;
};

const data = bundleData as BundleData;

export const steps = data.steps;
export const products = data.products;
export const initialActiveVariants = data.initialActiveVariants;
export const initialQuantities = data.initialQuantities;
export const categoryLabels = data.categoryLabels;
