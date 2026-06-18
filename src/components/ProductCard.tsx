import type { Product } from '../data/bundleData';
import {
  getActiveVariantId,
  getProductCardQuantity,
  getProductSelectedQuantity,
} from '../state/bundleSelectors';
import { useBundle } from '../state/bundleState';
import { PriceDisplay } from './PriceDisplay';
import { productOldPrice } from './priceUtils';
import { QuantityStepper } from './QuantityStepper';
import { VariantSelector } from './VariantSelector';

type ProductCardProps = {
  product: Product;
  controls?: boolean;
};

export function ProductCard({ product, controls = true }: ProductCardProps) {
  const { state, dispatch } = useBundle();
  const activeVariantId = getActiveVariantId(product, state);
  const cardQuantity = getProductCardQuantity(product, state);
  const selectedQuantity = getProductSelectedQuantity(product, state);

  return (
    <article
      className={`flex gap-4.75 min-h-39.75 rounded-[10px] bg-white p-2.75 ${
        selectedQuantity > 0
          ? 'border-2 border-[#4E2FD2]/70'
          : 'border border-transparent'
      }`}
    >
      <div className='relative grid h-full w-25.25 shrink-0 place-items-center overflow-visible rounded-[5px] bg-white'>
        <img
          src={product.image}
          alt=''
          className='max-h-34.25 w-full object-contain'
        />
        {product.badge ? (
          <span className='absolute left-0 top-0 rounded-[10px] bg-[#4E2FD2] px-1.5 py-0.5 text-[12px] font-semibold leading-3.75 text-white'>
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className='flex min-w-0 flex-1 flex-col justify-between gap-2.5'>
        <div className='space-y-2'>
          <h3 className='text-[16px] tracking-[0.6px] font-semibold leading-4 text-[#1F1F1F]'>
            {product.title}
          </h3>
          {product.description ? (
            <p className='text-[12px] font-medium tracking-[0.6px] leading-[15.6px] text-[#1F1F1F]/75'>
              {product.description}{' '}
              <a
                href='#'
                className='font-medium text-[#0000EE] underline'
                onClick={(event) => event.preventDefault()}
              >
                Learn More
              </a>
            </p>
          ) : null}
        </div>

        {controls ? (
          <VariantSelector
            product={product}
            activeVariantId={activeVariantId}
            onSelect={(variantId) =>
              dispatch({
                type: 'selectVariant',
                productId: product.id,
                variantId,
              })
            }
          />
        ) : null}

        <div className='flex items-center justify-between gap-2.5'>
          {controls ? (
            <QuantityStepper
              value={cardQuantity}
              ariaLabel={product.title}
              size='product'
              min={product.minQuantity ?? 0}
              onIncrement={() =>
                dispatch({
                  type: 'incrementQuantity',
                  productId: product.id,
                  variantId: activeVariantId,
                })
              }
              onDecrement={() =>
                dispatch({
                  type: 'decrementQuantity',
                  productId: product.id,
                  variantId: activeVariantId,
                })
              }
            />
          ) : (
            <span aria-hidden='true' />
          )}
          <PriceDisplay
            price={product.price}
            oldPrice={productOldPrice(product)}
            suffix={product.category === 'plan' ? '/mo' : ''}
            tone='product'
          />
        </div>
      </div>
    </article>
  );
}
