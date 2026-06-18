import type { ReviewLine } from '../state/bundleSelectors';
import { useBundle } from '../state/bundleState';
import { formatMoney } from './priceUtils';
import { QuantityStepper } from './QuantityStepper';

type ReviewLineItemProps = {
  line: ReviewLine;
};

export function ReviewLineItem({ line }: ReviewLineItemProps) {
  const { dispatch } = useBundle();
  const isPlan = line.category === 'plan';
  const isShipping = line.category === 'shipping';
  const canEditQuantity = !isPlan && !isShipping;
  const quantityDisabled = line.price === 0;
  const formatLinePrice = (amount: number) => {
    const price = formatMoney(amount);
    return isPlan && price !== 'FREE' ? `${price}/mo` : price;
  };

  return (
    <div className='flex min-h-10 items-center gap-3'>
      {isPlan || isShipping ? (
        <span className='grid h-10.25 w-10.25 shrink-0 place-items-center'>
          <img
            src={
              isPlan
                ? '/figma-icons/icon-cam-unlimited.svg'
                : '/figma-icons/icon-fast-shipping.svg'
            }
            alt=''
            className='h-6.5 w-6.5 object-contain'
          />
        </span>
      ) : (
        <img
          src={line.image}
          alt=''
          className='h-10.25 w-10.25 shrink-0 rounded-[5px] bg-white object-contain'
        />
      )}
      <div className='min-w-0 flex-1'>
        <p
          className={`text-[14px] leading-4 text-[#0B0D10] ${isPlan ? 'font-bold' : 'font-medium'}`}
        >
          {line.title}
        </p>
        {line.variant ? (
          <p className='text-[11px] leading-4 text-[#6F7882]'>
            {line.variant.label}
          </p>
        ) : null}
      </div>
      {canEditQuantity ? (
        <QuantityStepper
          value={line.quantity}
          ariaLabel={line.title}
          size='review'
          disabled={quantityDisabled}
          min={line.product.minQuantity ?? 0}
          onIncrement={() =>
            dispatch({
              type: 'incrementQuantity',
              productId: line.productId,
              variantId: line.variantId,
            })
          }
          onDecrement={() =>
            dispatch({
              type: 'decrementQuantity',
              productId: line.productId,
              variantId: line.variantId,
            })
          }
        />
      ) : null}
      <div className='min-w-10.75 text-right'>
        {line.oldPrice !== line.price ? (
          <p className='text-[14px] font-medium leading-4 text-[#6F7882] line-through'>
            {formatLinePrice(line.oldPrice * line.quantity)}
          </p>
        ) : null}
        <p className='text-[14px] font-semibold leading-4 text-[#4E2FD2]'>
          {line.price === 0
            ? 'FREE'
            : formatLinePrice(line.price * line.quantity)}
        </p>
      </div>
    </div>
  );
}
