import { ButtonSecondary } from '@/app/ui/Button';

export default function Overview() {
  return (
    <div className='bg-white pb-8 rounded-lg w-full'>
      <h1 className='font-semibold text-2xl px-4 py-2 border-b border-b-gray-100 mb-1'>
        Account Overview
      </h1>
      <div className='grid grid-cols-2 gap-4 p-4'>
        <div className='rounded-lg border border-black/15'>
          <h3 className='font-medium text-xl mb-2 border-b border-b/black/15 py-2 px-4'>
            Account details
          </h3>
          <div className='px-4 py-2 flex flex-col gap-1.5 justify-center items-start'>
            <p>Account name: John Doe</p>
            <p>Email: example@gmail.com </p>
            <ButtonSecondary>Edit</ButtonSecondary>
          </div>
        </div>
        <div className='rounded-lg border border-black/15'>
          <h3 className='font-medium text-xl mb-2 border-b border-b/black/15 py-2 px-4'>
            Account settings
          </h3>
          <div className='px-4 py-2 flex flex-col gap-1.5 justify-center items-start'>
            <p>Your default shipping address:</p>
            <p>John Doe</p>
            <p>1234 Main St</p>
            <p>Springfield, IL 62701</p>
            <p>+234 7066765698</p>
            <ButtonSecondary>Change</ButtonSecondary>
          </div>
        </div>
        <div className='rounded-lg border border-black/15'>
          <h3 className='font-medium text-xl mb-2 border-b border-b/black/15 py-2 px-4'>
            Newsletter
          </h3>
          <div className='px-4 py-2 flex flex-col gap-1.5 justify-center items-start'>
            <p>Subscribe to our newsletter</p>
            <ButtonSecondary>Subscribe</ButtonSecondary>
          </div>
        </div>
      </div>
    </div>
  );
}
