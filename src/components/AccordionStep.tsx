import { products, type BundleStep } from '../data/bundleData';
import { getStepSelectedCount } from '../state/bundleSelectors';
import { useBundle } from '../state/bundleState';
import { ProductCard } from './ProductCard';

type AccordionStepProps = {
  step: BundleStep;
};

const StepIcon = ({ stepId }: { stepId: BundleStep['id'] }) => {
  const iconByStep: Record<BundleStep['id'], string> = {
    cameras: '/figma-icons/icon-camera.svg',
    plan: '/figma-icons/icon-plan.svg',
    sensors: '/figma-icons/icon-sensors.svg',
    protection: '/figma-icons/icon-protection.svg',
  };

  return <img src={iconByStep[stepId]} alt='' className='h-6.5 w-6.5' />;
};

export function AccordionStep({ step }: AccordionStepProps) {
  const { state, dispatch } = useBundle();
  const open = state.openStepId === step.id;
  const isCameraStep = step.id === 'cameras';
  const selectedCount = getStepSelectedCount(step, state);
  const stepProducts = products.filter((product) => product.stepId === step.id);
  const stepLabel = step.label.toUpperCase();

  return (
    <section className={`${open ? 'rounded-[10px] bg-[#EDF4FF] pt-3.75' : ''}`}>
      <div className='flex items-center px-3.75'>
        <span
          className={`${open ? ` text-[12px] leading-3` : 'text-[10px] leading-2.5'} font-medium uppercase tracking-[1.6px] text-[#484848] max-md:text-[10px]`}
        >
          {stepLabel}
        </span>
      </div>

      <div
        className={`mt-1.25 border-[#1F1F1F]  px-3.75 py-5 ${
          open ? ` border-t-[0.5px]` : 'border-y-[0.5px]'
        }`}
      >
        <button
          type='button'
          onClick={() => dispatch({ type: 'openStep', stepId: step.id })}
          className={`flex w-full items-center justify-between gap-0.75`}
          aria-expanded={open}
        >
          <span className='flex min-w-0 text-start items-center gap-2'>
            <span className='h-6.5 w-6.5 shrink-0'>
              <StepIcon stepId={step.id} />
            </span>
            <span className='min-w-0 text-[22px] font-semibold leading-5.5 text-[#0B0D10] max-md:text-[18px] max-md:leading-4.5'>
              {step.title}
            </span>
          </span>
          <span className='flex items-center gap-1'>
            {open ? (
              <span className='shrink-0 text-[14px] font-medium leading-4 text-[#4E2FD2]'>
                {selectedCount} selected
              </span>
            ) : null}
            <span
              className='h-3 w-3 shrink-0 text-[#4E2FD2]'
              aria-hidden='true'
            >
              <img
                src={
                  open
                    ? '/figma-icons/icon-chevron-up.svg'
                    : '/figma-icons/icon-chevron-down.svg'
                }
                alt=''
                className='h-3 w-3'
              />
            </span>
          </span>
        </button>

        {open ? (
          <div className='mt-3.75 flex flex-col items-center gap-3.75'>
            {stepProducts.length ? (
              <div className='grid w-full grid-cols-2 gap-3.75 max-md:grid-cols-1 [&>*:last-child:nth-child(odd)]:col-span-2 [&>*:last-child:nth-child(odd)]:mx-auto [&>*:last-child:nth-child(odd)]:w-90 max-md:[&>*:last-child:nth-child(odd)]:col-span-1 max-md:[&>*:last-child:nth-child(odd)]:w-full'>
                {stepProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    controls={isCameraStep}
                  />
                ))}
              </div>
            ) : null}

            {step.nextLabel ? (
              <button
                type='button'
                onClick={() => dispatch({ type: 'nextStep' })}
                className='rounded-[7px] border border-[#4E2FD2] px-6 py-[7.5px] text-[18px] font-semibold leading-6 text-[#4E2FD2]'
              >
                {step.nextLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
