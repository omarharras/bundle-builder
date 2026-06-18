import { formatMoney } from './priceUtils';

type PriceDisplayProps = {
  price: number;
  oldPrice?: number;
  suffix?: string;
  tone?: 'product' | 'review';
};

export function PriceDisplay({
  price,
  oldPrice,
  suffix = '',
  tone = 'review',
}: PriceDisplayProps) {
  const oldLabel =
    oldPrice !== undefined ? `${formatMoney(oldPrice)}${suffix}` : undefined;
  const priceLabel = `${formatMoney(price)}${price === 0 ? '' : suffix}`;
  const oldClass = tone === 'product' ? 'text-[#D8392B]' : 'text-[#6F7882]';
  const priceClass = tone === 'product' ? 'text-[#575757]' : 'text-[#4E2FD2]';

  return (
    <div className='flex min-w-15.5 flex-col items-end'>
      {oldLabel ? (
        <span className={`text-[16px] leading-4 line-through ${oldClass}`}>
          {oldLabel}
        </span>
      ) : null}
      <span className={`text-[16px] font-medium leading-4 ${priceClass}`}>
        {priceLabel}
      </span>
    </div>
  );
}
