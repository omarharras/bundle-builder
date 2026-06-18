type QuantityStepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  min?: number;
  ariaLabel: string;
  size?: 'product' | 'review';
};

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  disabled = false,
  min = 0,
  ariaLabel,
  size = 'review',
}: QuantityStepperProps) {
  const decrementDisabled = disabled || value <= min;
  const incrementDisabled = disabled;
  const productSize = size === 'product';
  const activeButtonClass = productSize
    ? 'border border-transparent bg-[#F0F4F7] text-[#5F666D]'
    : 'border border-transparent bg-white text-[#5F666D]';
  const disabledButtonClass =
    'border-2 border-[#D8E0E8] bg-white text-[#A8B2BD]';

  return (
    <div
      className={`flex shrink-0 items-center rounded py-1 ${
        productSize ? 'h-8.75 gap-2.5' : 'h-7 gap-2.75'
      }`}
      aria-label={ariaLabel}
    >
      <button
        type='button'
        className={`flex h-5 w-5 items-center justify-center rounded p-0 text-[18px] leading-none ${
          decrementDisabled ? disabledButtonClass : activeButtonClass
        }`}
        onClick={onDecrement}
        disabled={decrementDisabled}
        aria-label={`Decrease ${ariaLabel}`}
      >
        <span className='-mt-px block leading-none'>-</span>
      </button>
      <span className='min-w-2.5 text-center text-[14px] font-semibold leading-4 text-[#0B0D10]'>
        {value}
      </span>
      <button
        type='button'
        className={`flex h-5 w-5 items-center justify-center rounded p-0 text-[18px] leading-none ${
          incrementDisabled ? disabledButtonClass : activeButtonClass
        }`}
        onClick={onIncrement}
        disabled={incrementDisabled}
        aria-label={`Increase ${ariaLabel}`}
      >
        <span className='-mt-px block leading-none'>+</span>
      </button>
    </div>
  );
}
