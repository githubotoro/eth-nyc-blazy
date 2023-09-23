import {ArrowRightIcon} from '@heroicons/react/24/outline';
import PrivyLogo from './privy-logo';
import Image from 'next/image';

export function Header() {
  return (
    <header className="flex shrink-0 grow-0 flex-col items-center gap-y-8 py-5 md:flex-row">
      <div className="grow-1 flex w-full items-center gap-x-2">
        <div className="relative aspect-square h-[22px]">
          <Image src="/icon.png" fill className="object-cover" />
        </div>

        <div className="text-medium text-md flex h-[22px] items-center justify-center rounded-full border-2 border-isRedDark py-1 px-2 font-bold text-isRedDark">
          Blazy
        </div>
      </div>

      <div className="text-md hidden shrink-0 grow-0 flex-col items-center rounded-lg px-3 py-1 font-sans font-medium text-isSystemDarkTertiary drop-shadow-sm md:flex md:flex-row md:bg-isGrayLightEmphasis6">
        💡 Let's make <b className="font-bold">&nbsp;web3 ideas</b>&nbsp;pass&nbsp;
        <i>*the mom test*</i>
        ...
        {/* <a
          href="https://privy.io/signup"
          target="_blank"
          rel="noreferrer"
          className="button button-primary flex items-center gap-x-2 rounded-[13px] px-3 py-2 text-[14px] text-white md:py-0"
        >
          Get started now
          <ArrowRightIcon className="h-4 w-4" strokeWidth={2} />
        </a> */}
      </div>
    </header>
  );
}
