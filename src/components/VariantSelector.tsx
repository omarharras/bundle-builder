import type { Product, VariantId } from '../data/bundleData';

type VariantSelectorProps = {
  product: Product;
  activeVariantId?: VariantId;
  onSelect: (variantId: VariantId) => void;
};

export function VariantSelector({
  product,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (!product.variants?.length) {
    return null;
  }

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {product.variants.map((variant) => {
        const active = variant.id === activeVariantId;

        return (
          <button
            type='button'
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            className={`flex h-6.5 w-16.25 shrink-0 items-center overflow-visible rounded-xs border-[0.5px] py-px text-[10px] font-medium leading-2.5 text-[#1F1F1F] ${
              active
                ? 'border-[#0AA288] bg-[#1DF0BB0A] px-0.75'
                : 'border-[#CCCCCC] bg-white px-1.25'
            }`}
            aria-pressed={active}
          >
            <img
              src={variant.image}
              alt=''
              className='shrink-0 rounded-[5px] object-contain h-6 w-6'
            />
            <span className='block tracking-[0.6px] leading-2.5'>
              {variant.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
