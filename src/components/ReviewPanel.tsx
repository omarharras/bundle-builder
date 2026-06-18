import { categoryLabels, type Category } from '../data/bundleData';
import { getReviewLines, getTotals } from '../state/bundleSelectors';
import { useBundle } from '../state/bundleState';
import { formatMoney } from './priceUtils';
import { ReviewLineItem } from './ReviewLineItem';

const visibleCategories: Category[] = [
  'cameras',
  'sensors',
  'accessories',
  'plan',
];

export function ReviewPanel() {
  const { state, saveSystem, dispatch } = useBundle();
  const lines = getReviewLines(state);
  const totals = getTotals(state);
  const shippingLine = lines.find((line) => line.category === 'shipping');

  return (
    <aside className='flex flex-col gap-1.25 w-full rounded-[10px] bg-[#EDF4FF] pt-3.75 lg:sticky lg:top-6 lg:w-99.75'>
      <div className='px-3.75 text-[12px] font-medium leading-3 tracking-[1.6px] uppercase text-[#484848]'>
        Review
      </div>
      <div className='flex flex-col gap-2.5 p-5 pb-7.75'>
        <div className='flex flex-col gap-1.25'>
          <h2 className='text-[22px] font-semibold leading-5.5 tracking-[0.6px] text-[#1F1F1F]'>
            Your security system
          </h2>
          <p className='text-[14px] font-medium leading-[18.2px] tracking-[0.6px] text-[#1F1F1F]/75'>
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </div>

        <div className='flex flex-col gap-2.5'>
          {visibleCategories.map((category) => {
            const categoryLines = lines.filter(
              (line) => line.category === category,
            );
            if (!categoryLines.length) {
              return null;
            }

            return (
              <section
                key={category}
                className='border-t border-[#CED6DE] pt-3.75'
              >
                <h3 className='text-[12px] leading-4 tracking-[3%] uppercase text-[#A8B2BD]'>
                  {categoryLabels[category]}
                </h3>
                <div className='mt-2 space-y-3'>
                  {categoryLines.map((line) => (
                    <ReviewLineItem key={line.lineId} line={line} />
                  ))}
                </div>
              </section>
            );
          })}

          {shippingLine ? (
            <section className='border-t border-[#CED6DE] pt-3.75'>
              <ReviewLineItem line={shippingLine} />
            </section>
          ) : null}
        </div>

        <div className='mx-auto w-full max-w-87.5 pb-5 pt-3'>
          <div className='flex h-19.5 items-center justify-between'>
            <img
              src='/figma-assets/satisfaction-badge.png'
              alt=''
              className='h-19.5 w-19.5 shrink-0 object-contain'
            />
            <div className='flex w-36.25 flex-col items-end gap-2'>
              <span className='rounded-[3px] bg-[#4E2FD2] px-2 py-1.25 text-[12px] font-medium leading-2 text-white'>
                as low as $19.19/mo
              </span>
              <div className='flex items-baseline gap-2'>
                <span className='text-[18px] font-medium leading-5 text-[#6F7882] line-through'>
                  {formatMoney(totals.oldTotal)}
                </span>
                <span className='text-[24px] font-bold leading-8 text-[#4E2FD2]'>
                  {formatMoney(totals.total)}
                </span>
              </div>
            </div>
          </div>

          <p className='mt-2 text-center text-[12px] font-semibold leading-3 text-[#0AA288]'>
            Congrats! You are saving {formatMoney(totals.savings)} on your
            security bundle!
          </p>

          <button
            type='button'
            onClick={() => dispatch({ type: 'checkout' })}
            className='mt-1 h-12 w-full rounded bg-[#4E2FD2] text-[17px] font-bold leading-[21.76px] text-white'
          >
            Checkout
          </button>
          {state.checkoutStatus === 'confirmed' ? (
            <p className='mt-2 text-center text-[12px] text-[#0AA288]'>
              Checkout confirmed for this prototype.
            </p>
          ) : null}

          <button
            type='button'
            onClick={saveSystem}
            className='mt-2 w-full text-center text-[14px] underline italic leading-[16.8px] text-[#484848]'
          >
            {state.saveStatus === 'saved'
              ? 'System saved'
              : 'Save my system for later'}
          </button>
        </div>
      </div>
    </aside>
  );
}
