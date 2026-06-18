import { AccordionStep } from './components/AccordionStep';
import { ReviewPanel } from './components/ReviewPanel';
import { steps } from './data/bundleData';
import { BundleProvider } from './state/bundleState';

function App() {
  return (
    <BundleProvider>
      <main className='min-h-screen bg-white px-5 py-8 text-[#0B0D10] md:px-8 lg:px-0'>
        <div className='mx-auto grid max-w-303.25 grid-cols-1 gap-7 lg:grid-cols-[768px_399px] lg:items-start'>
          <section>
            <h1 className='mb-5 text-center text-[31.875px] font-bold leading-[35.0625px] text-[#1F1F1F] lg:hidden'>
              Let's get started!
            </h1>
            <div className='flex flex-col gap-3.25'>
              {steps.map((step) => (
                <AccordionStep key={step.id} step={step} />
              ))}
            </div>
          </section>

          <ReviewPanel />
        </div>
      </main>
    </BundleProvider>
  );
}

export default App;
